package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.response.SportRatingResponse;
import com.arenaaxis.userservice.entity.RatingStoreSport;
import com.arenaaxis.userservice.repository.RatingStoreSportRepository;
import com.arenaaxis.userservice.service.RatingStoreSportService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RatingStoreSportServiceImpl implements RatingStoreSportService {
  RatingStoreSportRepository ratingStoreSportRepository;

  @Override
  public List<SportRatingResponse> sportRatingsOfStore(String storeId) {
    List<RatingStoreSport> allRatings = ratingStoreSportRepository.findByStoreId(storeId);
    return allRatings.stream().map(rating ->
      SportRatingResponse.builder()
        .id(rating.getSport().getId())
        .name(rating.getSport().getName())
        .nameEn(rating.getSport().getNameEnglish())
        .star((float) rating.getRatingScore() / rating.getRatingCount())
        .build()
    ).toList();
  }
}
