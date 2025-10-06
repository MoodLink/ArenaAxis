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
    @Index(name = "index_store_id", columnList = "store_id")
  }
)
public class ApplyOptionalPlan {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "store_id")
  Store store;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "optional_plan_id")
  OptionalPlan optionalPlan;

  @Builder.Default
  LocalDateTime createdAt = LocalDateTime.now();
  LocalDateTime deletedAt = LocalDateTime.now();

  Long price;
}
