package com.arenaaxis.userservice.entity;

import com.arenaaxis.userservice.entity.enums.UtilityType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(
  indexes = @Index(name = "utility_store_id", columnList = "store_id")
)
public class StoreUtility {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @Enumerated(EnumType.STRING)
  UtilityType type;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "store_id")
  Store store;

  @Builder.Default
  LocalDate createdAt = LocalDate.now();

  @Builder.Default
  LocalDate updatedAt = LocalDate.now();

  LocalDate deletedAt;

  @PrePersist
  public void onUpdate() {
    updatedAt = LocalDate.now();
  }
}
