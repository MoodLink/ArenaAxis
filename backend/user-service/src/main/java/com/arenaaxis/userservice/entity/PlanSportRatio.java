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
public class PlanSportRatio {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "sport_Id")
  Sport sport;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "plan_id")
  MainPlan plan;

  Float ratio;

  @Builder.Default
  LocalDateTime createdAt = LocalDateTime.now();
  LocalDateTime deletedAt;
}
