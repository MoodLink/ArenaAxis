package com.arenaaxis.userservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class OptionalPlan {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  String name;
  Long price;
  String description;

  @Builder.Default
  LocalDateTime createdAt = LocalDateTime.now();

  @Builder.Default
  LocalDateTime updatedAt = LocalDateTime.now();
  LocalDateTime deletedAT;
}
