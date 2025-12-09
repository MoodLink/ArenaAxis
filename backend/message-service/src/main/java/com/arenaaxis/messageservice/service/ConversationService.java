package com.arenaaxis.messageservice.service;

import com.arenaaxis.messageservice.dto.request.SearchConversationRequest;
import com.arenaaxis.messageservice.dto.response.ConversationResponse;
import reactor.core.publisher.Flux;

public interface ConversationService {
  Flux<ConversationResponse> getConversationsOfUserId(SearchConversationRequest request, int page, int perPage);
}
