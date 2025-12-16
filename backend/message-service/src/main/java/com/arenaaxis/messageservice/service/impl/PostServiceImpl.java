package com.arenaaxis.messageservice.service.impl;

import com.arenaaxis.messageservice.client.service.StoreClientService;
import com.arenaaxis.messageservice.dto.request.ApplyPostRequest;
import com.arenaaxis.messageservice.dto.request.PostCreateRequest;
import com.arenaaxis.messageservice.dto.request.SearchPostRequest;
import com.arenaaxis.messageservice.dto.response.ApplyPostResponse;
import com.arenaaxis.messageservice.dto.response.ApplyResponse;
import com.arenaaxis.messageservice.dto.response.PostResponse;
import com.arenaaxis.messageservice.exception.AppException;
import com.arenaaxis.messageservice.exception.ErrorCode;
import com.arenaaxis.messageservice.mapper.MatchMapper;
import com.arenaaxis.messageservice.mapper.PostMapper;
import com.arenaaxis.messageservice.mapper.StoreMapper;
import com.arenaaxis.messageservice.model.*;
import com.arenaaxis.messageservice.model.enums.Sport;
import com.arenaaxis.messageservice.repository.ApplyPostRepository;
import com.arenaaxis.messageservice.repository.MatchRepository;
import com.arenaaxis.messageservice.repository.PostRepository;
import com.arenaaxis.messageservice.repository.StoreRepository;
import com.arenaaxis.messageservice.service.ParticipantService;
import com.arenaaxis.messageservice.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostServiceImpl implements PostService {
  @NonFinal
  @Value("${match.limit}")
  int limitMatchDays;

  PostRepository postRepository;
  MatchRepository matchRepository;
  StoreRepository storeRepository;
  ApplyPostRepository applyPostRepository;

  StoreClientService storeClientService;
  ParticipantService participantService;

  PostMapper postMapper;
  StoreMapper storeMapper;
  MatchMapper matchMapper;

  @Override
  public Mono<PostResponse> createPost(PostCreateRequest request) {
    return findValidMatches(request.getMatchIds())
      .flatMap(this::markMatchesAsPosted)
      .flatMap(matches -> {
          Post post = buildPost(request, matches);
          return postRepository.save(post)
            .flatMap(savedPost -> mapToResponse(savedPost, matches));
      });
  }

  @Override
  public Mono<ApplyResponse> applyPost(ApplyPostRequest request) {
    return Mono.zip(
      participantService.createFromUserId(request.getUserId()),
      postRepository.findById(request.getPostId())
    ).flatMap(tuple -> {
      Participant applier = tuple.getT1();
      Post post = tuple.getT2();

      int nextNumber = post.getCurrentNumber() + request.getNumber();
      if (nextNumber > post.getRequiredNumber()) {
        return Mono.error(new AppException(ErrorCode.INVALID_APPLY_POST));
      }

      post.setCurrentNumber(nextNumber);

      List<String> participantIds = post.getParticipantIds();
      if (participantIds == null) participantIds = new ArrayList<>();
      participantIds.add(request.getUserId());
      post.setParticipantIds(participantIds);

      ApplyPost applyPost = ApplyPost.builder()
        .participantId(applier.getId())
        .postId(post.getId())
        .number(request.getNumber())
        .build();

      return postRepository.save(post)
        .then(applyPostRepository.save(applyPost)
          .flatMap(apply ->mapToApplyResponse(apply, applier, post)));
    });
  }

  @Override
  public Flux<PostResponse> searchPost(SearchPostRequest request, int page, int perPage) {
    return null;
  }

  @Override
  public Mono<PostResponse> updatePost(PostCreateRequest request) {
    return null;
  }

  private Mono<List<Match>> findValidMatches(List<String> matchIds) {
    return matchRepository.findAllByIdsAndTime(
        matchIds,
        LocalDate.now().plusDays(limitMatchDays)
      )
      .collectList()
      .flatMap(matches -> {
        if (matches.size() != matchIds.size()) {
          return Mono.error(new AppException(ErrorCode.MATCH_NOT_FOUND));
        }

        return Mono.just(matches);
      });
  }

  private Mono<List<Match>> markMatchesAsPosted(List<Match> matches) {
    matches.forEach(match -> match.setIsPosted(true));
    return matchRepository.saveAll(matches).collectList();
  }

  private Post buildPost(PostCreateRequest request, List<Match> matches) {
    long totalPrice = calculateTotalPrice(matches);
    long pricePerPerson = calculatePricePerPerson(
      totalPrice,
      request.getRequiredNumber()
    );

    Post post = postMapper.fromRequest(request);
    post.setMatchIds(request.getMatchIds());
    post.setPosterId(request.getUserId());
    post.setPricePerPerson(pricePerPerson);
    post.setSportId(matches.get(0).getSportId());
    post.setStoreId(matches.get(0).getStoreId());

    return post;
  }

  private long calculateTotalPrice(List<Match> matches) {
    return matches.stream()
      .mapToLong(Match::getPrice)
      .sum();
  }

  private long calculatePricePerPerson(long totalPrice, int requiredNumber) {
    return (long) Math.ceil((double) totalPrice / requiredNumber);
  }

  private Mono<PostResponse> mapToResponse(Post post, List<Match> matches) {
    String storeId = matches.get(0).getStoreId();
    return Mono.zip(
        getStore(storeId),
        participantService.createFromUserId(post.getPosterId())
      )
      .map(tuple -> {
        Store store = tuple.getT1();
        Participant poster = tuple.getT2();

        PostResponse response = postMapper.toResponse(post);
        response.setMatches(matches.stream().map(matchMapper::toResponse).toList());
        response.setStore(storeMapper.toResponse(store));
        response.setPoster(poster);
        response.setSport(Objects.requireNonNull(Sport.getById(post.getSportId()))
          .toResponse());

        return response;
      });
  }

  private Mono<ApplyResponse> mapToApplyResponse(
    ApplyPost applyPost,
    Participant applier,
    Post post
  ) {
    return Mono.zip(
      getStore(post.getStoreId()),
      participantService.createFromUserId(post.getPosterId())
    ).map(tuple -> {
      Participant poster = tuple.getT2();
      Store store = tuple.getT1();

      ApplyPostResponse postResponse = ApplyPostResponse.builder()
        .id(post.getId())
        .poster(poster)
        .title(post.getTitle())
        .timestamp(post.getTimestamp())
        .store(storeMapper.toResponse(store))
        .build();

      return ApplyResponse.builder()
        .timestamp(applyPost.getAppliedAt())
        .post(postResponse)
        .applier(applier)
        .number(applyPost.getNumber())
        .build();
    });
  }

  private Mono<Store> getStore(String storeId) {
    return storeRepository.findById(storeId)
      .switchIfEmpty(storeClientService.getStoreById(storeId).flatMap(store -> {
        Store storeModel = Store.builder()
          .id(store.getId())
          .name(store.getName())
          .address(store.getAddress())
          .build();
        return storeRepository.insert(storeModel);
      }));
  }
}
