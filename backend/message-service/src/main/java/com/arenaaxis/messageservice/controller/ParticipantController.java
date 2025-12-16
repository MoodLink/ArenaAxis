package com.arenaaxis.messageservice.controller;

import com.arenaaxis.messageservice.dto.request.UpdateParticipantRequest;
import com.arenaaxis.messageservice.service.ParticipantService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/participants")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ParticipantController {
  ParticipantService participantService;

  @PatchMapping
  public Mono<Void> updateParticipant(@RequestBody UpdateParticipantRequest request) {
    return participantService.updateParticipant(request).then();
  }
}
