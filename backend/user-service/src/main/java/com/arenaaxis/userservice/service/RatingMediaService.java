package com.arenaaxis.userservice.service;

import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.web.multipart.MultipartFile;

import com.arenaaxis.userservice.entity.Media;
import com.arenaaxis.userservice.entity.Rating;

public interface RatingMediaService {
  @Async
  void createMultiple(Rating rating, List<MultipartFile> files);

  List<Media> getMediaFromRatingId(String ratingId);

  @Async
  void delete(String id);
}
