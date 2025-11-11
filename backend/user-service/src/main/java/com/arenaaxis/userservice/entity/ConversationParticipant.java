package com.arenaaxis.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(
  indexes = {
    @Index(name = "index_participant_user_id", columnList = "user_id"),
    @Index(name = "index_participant_conversation_id", columnList = "conversation_id")
  }
)
public class ConversationParticipant {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id", nullable = false)
  User user;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "conversation_id", nullable = false)
  Conversation conversation;

  @Builder.Default
  LocalDateTime createdAt = LocalDateTime.now();
}
