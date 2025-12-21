package com.arenaaxis.userservice.service.impl;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import com.arenaaxis.userservice.repository.MediaRepository;
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
  MediaRepository mediaRepository;

  @Async
  @Override
  public void createMultiple(Rating rating, List<MultipartFile> files) {
    if (files == null || files.isEmpty()) return;

    List<CompletableFuture<Media>> futures = files.stream()
      .map(mediaService::createMediaAsync)
      .toList();

    CompletableFuture.allOf(
      futures.toArray(new CompletableFuture[0])
    ).join();

    futures.forEach(f -> {
      Media media = f.join();
      ratingMediaRepository.save(
        RatingMedia.builder()
          .media(media)
          .rating(rating)
          .build()
      );
    });
  }

  @Override
  public List<Media> getMediaFromRatingId(String ratingId) {
    return ratingMediaRepository.getMediasFromRatingId(ratingId);
  }

  @Async
  @Override
  public void delete(String id) {
    mediaRepository.findById(id).ifPresent(media -> {
      mediaService.deleteMedia(media);
      ratingMediaRepository.deleteById(id);
    });
  }

  @Async
  @Override
  public void delete(List<String> mediaIds) {
    List<Media> medias = mediaRepository.findAllById(mediaIds);
    mediaService.deleteMedias(medias);
  }
}
