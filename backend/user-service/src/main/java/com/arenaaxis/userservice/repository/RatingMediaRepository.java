package com.arenaaxis.userservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.arenaaxis.userservice.entity.Media;
import com.arenaaxis.userservice.entity.RatingMedia;

@Repository
public interface RatingMediaRepository extends JpaRepository<RatingMedia, String> {
  @Query("SELECT rm.media FROM RatingMedia rm WHERE rm.rating.id = :ratingId")
  List<Media> getMediasFromRatingId(@Param("ratingId") String ratingId);
}
