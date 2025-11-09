package com.arenaaxis.userservice.service.impl;

import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.arenaaxis.userservice.entity.Media;
import com.arenaaxis.userservice.entity.Rating;
import com.arenaaxis.userservice.entity.RatingMedia;
import com.arenaaxis.userservice.repository.RatingMediaRepository;
import com.arenaaxis.userservice.service.MediaService;
import com.arenaaxis.userservice.service.RatingMediaService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RatingMediaServiceImpl implements RatingMediaService {
  MediaService mediaService;
  RatingMediaRepository ratingMediaRepository;

  @Async
  @Override
  public void createMultiple(Rating rating, List<MultipartFile> files) {
    if (files == null || files.isEmpty()) return;

    files.stream().map(mediaService::createMedia).forEach(media -> {
      RatingMedia rm = RatingMedia.builder()
                                  .media(media)
                                  .rating(rating)
                                  .build();
      ratingMediaRepository.save(rm);
    });
  }

  @Override
  public List<Media> getMediaFromRatingId(String ratingId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'getMediaFromRatingId'");
  }

  @Override
  public void delete(String id) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'delete'");
  }

}
