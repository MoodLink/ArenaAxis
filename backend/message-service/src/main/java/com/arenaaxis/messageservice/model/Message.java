package com.arenaaxis.messageservice.model;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Message {
  @Id
  @Builder.Default
  String id = UUID.randomUUID().toString();
  String conversationId;
  String senderId;
  String content;
  MessageStatus status;

  @Builder.Default
  LocalDateTime timestamp = LocalDateTime.now();

  public enum MessageStatus {
    SEND,
    RECEIVED,
    SEEN
  }
}
