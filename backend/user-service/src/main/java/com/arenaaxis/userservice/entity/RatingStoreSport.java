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
    @Index(name = "index_rating_store_sport_store_id", columnList = "store_id")
  }
)
public class RatingStoreSport {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @ManyToOne
  @JoinColumn(name = "store_id")
  Store store;

  @ManyToOne
  @JoinColumn(name = "sport_id")
  Sport sport;

  @Builder.Default
  Long ratingCount = 0L;

  @Builder.Default
  Long ratingScore = 0L;

  public void increaseRatingCount() {
    this.ratingCount += 1;
  }

  public void increaseRatingScore(long score) {
    this.ratingScore += score;
  }

  public void decreaseRatingCount() {
    this.ratingCount -= 1;
  }

  public void decreaseRatingScore(long score) {
    this.ratingScore -= score;
  }
}
