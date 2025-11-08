package com.arenaaxis.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(
  indexes = {
    @Index(name = "index_media_rating_id", columnList = "media_id"),
    @Index(name = "index_rating_media_rating_id", columnList = "rating_id")
  }
)
public class RatingMedia {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @OneToOne
  @JoinColumn(name = "media_id", nullable = false)
  Media media;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "rating_id", nullable = false)
  Rating rating;
}
