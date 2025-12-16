package com.arenaaxis.messageservice.model;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "conversations")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Conversation {
  @Id
  @Builder.Default
  String id = UUID.randomUUID().toString();

  List<String> participantIds;

  Message lastMessage;
  LocalDateTime lastMessageAt;

  @Builder.Default
  LocalDateTime createdAt = LocalDateTime.now();
}
