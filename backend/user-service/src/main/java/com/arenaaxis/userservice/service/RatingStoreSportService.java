package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.response.SportRatingResponse;

import java.util.List;

public interface RatingStoreSportService {
  List<SportRatingResponse> sportRatingsOfStore(String storeId);
}
