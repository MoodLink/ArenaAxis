package com.arenaaxis.messageservice.service.impl;

import com.arenaaxis.messageservice.dto.request.SearchConversationRequest;
import com.arenaaxis.messageservice.dto.response.ConversationResponse;
import com.arenaaxis.messageservice.dto.response.ParticipantResponse;
import com.arenaaxis.messageservice.mapper.ConversationMapper;
import com.arenaaxis.messageservice.mapper.ParticipantMapper;
import com.arenaaxis.messageservice.model.Conversation;
import com.arenaaxis.messageservice.model.Message;
import com.arenaaxis.messageservice.model.Participant;
import com.arenaaxis.messageservice.repository.ConversationRepository;
import com.arenaaxis.messageservice.repository.ParticipantRepository;
import com.arenaaxis.messageservice.service.ConversationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConversationServiceImpl implements ConversationService {
  ConversationRepository conversationRepository;
  ParticipantRepository participantRepository;

  ConversationMapper conversationMapper;
  ParticipantMapper participantMapper;

  @Override
  public Flux<ConversationResponse> getConversationsOfUserId(SearchConversationRequest request, int page, int perPage) {
    if (request.getReceiverName() == null) {
      Pageable pageable = PageRequest.of(page, perPage, Sort.by(Sort.Direction.DESC, "lastMessageAt"));
      return conversationRepository.findByParticipantIdsContains(request.getUserId(), pageable)
        .flatMap(conversation -> this.mapConversationToResponse(conversation, request.getUserId()));
    }

    return conversationRepository.findByUserIdAndReceiverNameLike(
      request.getUserId(),
      request.getReceiverName(),
      page * perPage,
      perPage
    ).flatMap(conversation -> this.mapConversationToResponse(conversation, request.getUserId()));
  }

  private Mono<ConversationResponse> mapConversationToResponse(Conversation conversation, String currentUserId) {
    return findParticipants(conversation.getParticipantIds())
      .map(participantMapper::toResponse)
      .collectList()
      .map(participants -> {
        ConversationResponse response = conversationMapper.toResponse(conversation);
        response.setParticipants(participants);

        ParticipantResponse other = participants
          .stream()
          .filter(id -> !id.equals(currentUserId))
          .findFirst()
          .orElse(null);

        if (other != null) {
          response.setName(other.getName());
          response.setAvatarUrl(other.getAvatarUrl());
        }

        if (
          conversation.getLastMessage().getStatus() == Message.MessageStatus.RECEIVED ||
          conversation.getLastMessage().getSenderId().equals(currentUserId)
        ) {
          response.setSeen(true);
        }

        return response;
      });
  }

  private Flux<Participant> findParticipants(List<String> ids) {
    return participantRepository.findAllById(ids);
  }
}
