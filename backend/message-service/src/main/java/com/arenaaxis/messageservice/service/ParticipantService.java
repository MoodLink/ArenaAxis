package com.arenaaxis.messageservice.service;

import com.arenaaxis.messageservice.dto.request.UpdateParticipantRequest;
import com.arenaaxis.messageservice.model.Participant;
import reactor.core.publisher.Mono;

public interface ParticipantService {
  Mono<Participant> createParticipant(Participant participant);
  Mono<Participant> createFromUserId(String userId);
  Mono<Participant> updateParticipant(UpdateParticipantRequest participant);
}
