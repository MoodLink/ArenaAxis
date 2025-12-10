package com.arenaaxis.messageservice.service;

import com.arenaaxis.messageservice.model.Message;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface MessageService {
  Mono<Message> createMessage(String receiverId, Message message);
  Flux<Message> getMessagesByConversation(String conversationId, int page, int perPage);
}
