package com.arenaaxis.messageservice.controller;

import com.arenaaxis.messageservice.dto.request.SearchConversationRequest;
import com.arenaaxis.messageservice.dto.response.ConversationResponse;
import com.arenaaxis.messageservice.model.Conversation;
import com.arenaaxis.messageservice.service.ConversationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/conversations")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConversationController {
  ConversationService conversationService;

  @GetMapping
  public Mono<ResponseEntity<List<ConversationResponse>>> getConversations(
    @RequestParam(required = false, value = "userId") String userId,
    @RequestParam(required = false, value = "receiverName") String receiverName,
    @RequestParam(defaultValue = "0", required = false) int page,
    @RequestParam(defaultValue = "12", required = false) int perPage
  ) {
    SearchConversationRequest request = SearchConversationRequest.builder()
      .userId(userId)
      .receiverName(receiverName)
      .build();

    return conversationService.getConversationsOfUserId(request, page, perPage)
      .collectList()
      .map(ResponseEntity::ok);
  }
}
