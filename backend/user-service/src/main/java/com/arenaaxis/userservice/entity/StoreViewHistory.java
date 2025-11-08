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
@Table(indexes = @Index(name = "index_history_user_id", columnList = "user_id"))
public class StoreViewHistory {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id", nullable = false)
  User user;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "store_id", nullable = false)
  Store store;

  @Builder.Default
  LocalDateTime createdAt = LocalDateTime.now();
}
