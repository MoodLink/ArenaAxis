package com.arenaaxis.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(
  uniqueConstraints = @UniqueConstraint(columnNames = {"store_id", "sport_id"}),
  indexes = {
    @Index(name = "store_has_sport_sport_id", columnList = "sport_id"),
    @Index(name = "store_has_sport_store_id", columnList = "store_id"),
  }
)
public class StoreHasSport {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @ManyToOne
  @JoinColumn(name = "sport_id", nullable = false)
  Sport sport;

  @ManyToOne
  @JoinColumn(name = "store_id", nullable = false)
  Store store;

  @Builder.Default
  boolean hasSport = false;
}
