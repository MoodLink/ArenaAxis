package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.RatingRequest;
import com.arenaaxis.userservice.dto.request.RatingUpdateRequest;
import com.arenaaxis.userservice.dto.request.SearchRatingRequest;
import com.arenaaxis.userservice.dto.response.RatingResponse;
import com.arenaaxis.userservice.entity.User;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface RatingService {
  RatingResponse create(RatingRequest request, List<MultipartFile> medias, User current);
  RatingResponse update(String ratingId, RatingUpdateRequest request, List<MultipartFile> medias, User current);
  List<RatingResponse> getPageRatingForStore(SearchRatingRequest request, int page, int perPage);
  RatingResponse getById(String id);
  void delete(String ratingId, User current);
}
