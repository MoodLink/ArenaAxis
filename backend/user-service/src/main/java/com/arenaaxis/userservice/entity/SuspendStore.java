package com.arenaaxis.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(
  indexes = @Index(name = "suspend_store_id", columnList = "user_id")
)
public class SuspendStore {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "store_id")
  Store store;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id")
  User operator;

  LocalDate startAt;
  LocalDate endAt;

  @Column(columnDefinition = "TEXT")
  String reason;

  @Builder.Default
  LocalDateTime createdAt = LocalDateTime.now();

  @Builder.Default
  LocalDateTime updatedAt = LocalDateTime.now();

  LocalDateTime deletedAt;

  @PrePersist
  public void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
