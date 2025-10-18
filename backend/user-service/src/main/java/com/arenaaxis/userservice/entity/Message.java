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
    @Index(name = "index_msg_sender_id", columnList = "sender_id"),
    @Index(name = "index_msg_conversation_id", columnList = "conversation_id")
  }
)
public class Message {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  String content;

  @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JoinColumn(name = "sender_id", nullable = false)
  ConversationParticipant sender;

  @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JoinColumn(name = "conversation_id", nullable = false)
  Conversation conversation;

  @Builder.Default
  LocalDateTime createdAt = LocalDateTime.now();
}
