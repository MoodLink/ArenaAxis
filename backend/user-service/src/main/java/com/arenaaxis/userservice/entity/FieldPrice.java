package com.arenaaxis.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(
  indexes = {
    @Index(name = "index_pricing_field_id", columnList = "field_id")
  }
)
public class FieldPrice {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  LocalDateTime deletedAt;

  @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JoinColumn(name = "field_id", nullable = false)
  Field field;

  Long price;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(
    name = "field_price_days",
    joinColumns = @JoinColumn(name = "field_price_id")
  )
  @Enumerated(EnumType.STRING)
  Set<DayOfWeek> dayOfWeeks;

  LocalTime startAt;
  LocalTime endAt;
}