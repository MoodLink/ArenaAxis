package com.arenaaxis.userservice.entity;

import com.arenaaxis.userservice.entity.enums.ConversationType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Conversation {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  String name;

  @Builder.Default
  LocalDateTime createdAt = LocalDateTime.now();

  @Enumerated(EnumType.STRING)
  ConversationType type;

  @OneToMany(fetch = FetchType.EAGER, mappedBy = "conversation")
  Set<ConversationParticipant> participants;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "conversation")
  Set<Message> messages;
}
