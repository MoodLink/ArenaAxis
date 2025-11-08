package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.RatingRequest;
import com.arenaaxis.userservice.dto.request.SearchRatingRequest;
import com.arenaaxis.userservice.dto.response.RatingResponse;
import com.arenaaxis.userservice.entity.User;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface RatingService {
  RatingResponse create(RatingRequest request, List<MultipartFile> medias, User current);

  RatingRequest update(RatingRequest request, User current);

  List<RatingResponse> getPageRatingForStore(SearchRatingRequest request, int page, int perPage);

  void delete(String ratingId, User current);
}
