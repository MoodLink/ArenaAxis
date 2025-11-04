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
    @Index(name = "index_rating_user_id", columnList = "user_id"),
    @Index(name = "index_rating_store_id", columnList = "store_id")
  }
)
public class Rating {
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

  @Builder.Default
  LocalDateTime updatedAt = LocalDateTime.now();

  @ManyToOne(fetch = FetchType.EAGER)
  Sport sport;

  Integer star;
  String comment;

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "rating")
  Set<RatingMedia> ratingMedias;
}
