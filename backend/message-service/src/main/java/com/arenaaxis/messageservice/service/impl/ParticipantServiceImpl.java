package com.arenaaxis.messageservice.service.impl;

import com.arenaaxis.messageservice.client.service.UserClientService;
import com.arenaaxis.messageservice.dto.request.UpdateParticipantRequest;
import com.arenaaxis.messageservice.exception.AppException;
import com.arenaaxis.messageservice.exception.ErrorCode;
import com.arenaaxis.messageservice.mapper.ParticipantMapper;
import com.arenaaxis.messageservice.model.Participant;
import com.arenaaxis.messageservice.repository.ParticipantRepository;
import com.arenaaxis.messageservice.service.ParticipantService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ParticipantServiceImpl implements ParticipantService {
  ParticipantRepository repository;
  UserClientService userClientService;
  ParticipantMapper participantMapper;
  private final ParticipantRepository participantRepository;

  @Override
  public Mono<Participant> createParticipant(Participant participant) {
    return createIfNotExists(participant.getId(),
      repository.save(participant)
    );
  }

  @Override
  public Mono<Participant> createFromUserId(String userId) {
    return createIfNotExists(userId,
      userClientService.getUserById(userId)
        .switchIfEmpty(Mono.error(new RuntimeException("User not found: " + userId)))
        .flatMap(client -> {
          log.info("User retrieved successfully: {}", client.getId());
          Participant participant = participantMapper.fromClient(client);
          return repository.save(participant);
        })
    );
  }

  @Override
  public Mono<Participant> getParticipant(String participantId) {
    return participantRepository.findById(participantId)
      .switchIfEmpty(Mono.error(new AppException(ErrorCode.USER_NOT_FOUND)));
  }

  @Override
  public Mono<Participant> updateParticipant(UpdateParticipantRequest request) {
    return repository.findById(request.getId())
      .switchIfEmpty(Mono.empty())
      .flatMap(existing -> {
        participantMapper.updateParticipantFromRequest(request, existing);
        return repository.save(existing);
      });
  }

  private Mono<Participant> createIfNotExists(String id, Mono<Participant> createMono) {
    return repository.findById(id)
      .flatMap(existing -> {
        log.info("Participant already exists: {}", existing.getId());
        return Mono.just(existing);
      })
      .switchIfEmpty(createMono);
  }
}
