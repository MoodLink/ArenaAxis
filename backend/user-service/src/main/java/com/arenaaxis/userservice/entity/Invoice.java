package com.arenaaxis.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(
  indexes = {
    @Index(name = "invoice_store_id", columnList = "store_Id")
  }
)
public class Invoice {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @ManyToOne
  @JoinColumn(name = "store_id")
  Store store;

  @Builder.Default
  LocalDateTime createdAt = LocalDateTime.now();

  @Builder.Default
  LocalDateTime updatedAt = LocalDateTime.now();
  LocalDateTime deletedAt;

  Double price;

  @PrePersist
  public void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
