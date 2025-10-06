package com.arenaaxis.userservice.entity;

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
@Table(
  indexes = {
    @Index(name = "index_field_store_id", columnList = "store_id"),
    @Index(name = "index_field_sport_id", columnList = "sport_id")
  }
)
public class Field {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  String name;

  @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JoinColumn(name = "sport_id", nullable = false)
  Sport sport;

  Long defaultPrice;

  @Builder.Default
  LocalDateTime createdAt = LocalDateTime.now();

  @Builder.Default
  LocalDateTime updatedAt = LocalDateTime.now();
  LocalDateTime deletedAt;

  Boolean active;

  @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JoinColumn(name = "store_id", nullable = false)
  Store store;

  @OneToMany(fetch = FetchType.EAGER, mappedBy = "field")
  Set<FieldPrice> fieldPrices;
}
