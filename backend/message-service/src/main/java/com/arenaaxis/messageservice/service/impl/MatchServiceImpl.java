package com.arenaaxis.messageservice.service.impl;

import com.arenaaxis.messageservice.client.dto.response.OrderClientResponse;
import com.arenaaxis.messageservice.client.service.OrderClientService;
import com.arenaaxis.messageservice.dto.response.MatchResponse;
import com.arenaaxis.messageservice.exception.AppException;
import com.arenaaxis.messageservice.exception.ErrorCode;
import com.arenaaxis.messageservice.mapper.MatchMapper;
import com.arenaaxis.messageservice.model.Match;
import com.arenaaxis.messageservice.model.enums.Sport;
import com.arenaaxis.messageservice.repository.MatchRepository;
import com.arenaaxis.messageservice.service.MatchService;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MatchServiceImpl implements MatchService {

  @NonFinal
  @Value("${match.limit}")
  int limitMatchDays;

  MatchRepository matchRepository;

  OrderClientService orderClientService;

  MatchMapper matchMapper;

  @Override
  public Flux<MatchResponse> getMatches(String orderId) {
    return matchRepository.existsByOrderId(orderId)
      .flatMapMany(exist -> {
        if (Boolean.TRUE.equals(exist)) {
          return matchRepository.findValidMatches(
            orderId,
            LocalDate.now().plusDays(limitMatchDays)
          );
        } else {
          return getOrder(orderId).flatMapMany(this::calcMatchesFromOrder);
        }
      })
      .map(this::mapToResponse);
  }

  private Flux<Match> calcMatchesFromOrder(OrderClientResponse order) {
    return groupMatches(parseSlots(order));
  }

  private List<Slot> parseSlots(OrderClientResponse order) {
    return order.getOrderDetails().stream()
      .map(d -> {
        LocalDate date = d.getStartTime().toLocalDate();
        LocalTime startAt = d.getStartTime().toLocalTime();
        LocalTime endAt = d.getEndTime().toLocalTime();

        return Slot.builder()
          .date(date)
          .startAt(startAt)
          .endAt(endAt)
          .price(d.getPrice())
          .fieldId(d.getFieldId())
          .storeId(order.getStoreId())
          .orderId(order.get_id())
          .sportId(d.getSportId())
          .fieldName(d.getName())
          .build();
      })
      .toList();
  }

  private Flux<Match> groupMatches(List<Slot> slots) {
    Map<String, List<Slot>> grouped = slots.stream()
      .collect(Collectors.groupingBy(
        s -> s.getFieldId() + "|" + s.getDate()
      ));

    List<Match> matches = grouped.values().stream()
      .flatMap(
        fieldSlots ->{
          List<Slot> sorted = fieldSlots.stream()
            .sorted(Comparator.comparing(Slot::getStartAt))
            .toList();

          List<Match> result = new ArrayList<>();
          Slot current = sorted.get(0);
          for (int i = 1; i < sorted.size(); i++) {
            Slot next = sorted.get(i);
            if (current.getEndAt().equals(next.getStartAt())) {
              current.setEndAt(next.getEndAt());
              current.setPrice(current.getPrice() + next.getPrice());
            } else {
              result.add(buildMatch(current));
              current = next;
            }
          }

          result.add(buildMatch(current));
          return result.stream();
        }
      )
//      .filter(match -> {
//        LocalDateTime time = LocalDateTime.of(match.getDate(), match.getStartTime());
//        return time.isAfter(LocalDateTime.now().minusDays(limitMatchDays));
//      })
      .toList();

    return matchRepository.saveAll(matches);
  }

  private Mono<OrderClientResponse> getOrder(String orderId) {
    return orderClientService.getOrderById(orderId)
      .switchIfEmpty(Mono.error(new AppException(ErrorCode.ORDER_NOT_FOUND)));
  }

  private Match buildMatch(Slot slot) {
    return Match.builder()
      .date(slot.getDate())
      .startTime(slot.getStartAt())
      .endTime(slot.getEndAt())
      .orderId(slot.getOrderId())
      .storeId(slot.getStoreId())
      .sportId(slot.getSportId())
      .price(slot.getPrice())
      .field(
        Match.Field.builder()
          .id(slot.getFieldId())
          .name(slot.getFieldName())
          .build()
      )
      .build();
  }

  private MatchResponse mapToResponse(Match match) {
    MatchResponse response = matchMapper.toResponse(match);
    response.setSport(Objects.requireNonNull(Sport.getById(match.getSportId())).toResponse());
    return response;
  }

  @Getter
  @Setter
  @Builder
  @AllArgsConstructor
  @NoArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  private static class Slot {
    String fieldId;
    String fieldName;
    LocalDate date;
    LocalTime startAt;
    LocalTime endAt;
    String orderId;
    String storeId;
    String sportId;
    Long price;
  }
}
