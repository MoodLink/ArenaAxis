package com.arenaaxis.messageservice.repository;

import com.arenaaxis.messageservice.model.Message;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface MessageRepository extends ReactiveMongoRepository<Message, String> {
  Flux<Message> findByConversationIdOrderByTimestampAsc(String conversationId);
}
