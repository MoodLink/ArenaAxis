package com.arenaaxis.messageservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConversationResponse {
  String id;
  String name;
  String avatarUrl;

  @Builder.Default
  Boolean seen = false;

  List<ParticipantResponse> participants;

  MessageResponse lastMessage;
  LocalDateTime lastMessageAt;
  LocalDateTime createdAt;
}
