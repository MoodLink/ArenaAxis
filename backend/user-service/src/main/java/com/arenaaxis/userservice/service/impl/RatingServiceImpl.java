package com.arenaaxis.userservice.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.arenaaxis.userservice.dto.request.RatingRequest;
import com.arenaaxis.userservice.dto.request.SearchRatingRequest;
import com.arenaaxis.userservice.dto.response.RatingResponse;
import com.arenaaxis.userservice.entity.Rating;
import com.arenaaxis.userservice.entity.RatingStoreSport;
import com.arenaaxis.userservice.entity.Sport;
import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.mapper.RatingMapper;
import com.arenaaxis.userservice.repository.RatingRepository;
import com.arenaaxis.userservice.repository.RatingStoreSportRepository;
import com.arenaaxis.userservice.repository.SportRepository;
import com.arenaaxis.userservice.repository.StoreHasSportRepository;
import com.arenaaxis.userservice.repository.StoreRepository;
import com.arenaaxis.userservice.service.RatingMediaService;
import com.arenaaxis.userservice.service.RatingService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RatingServiceImpl implements RatingService {
  RatingMapper ratingMapper;

  StoreRepository storeRepository;
  SportRepository sportRepository;
  RatingRepository ratingRepository;
  StoreHasSportRepository storeHasSportRepository;
  RatingStoreSportRepository ratingStoreSportRepository;

  RatingMediaService ratingMediaService;

  @Override
  public RatingResponse create(RatingRequest request, List<MultipartFile> medias, User current) {
    Store store = storeRepository.findById(request.getStoreId())
      .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

    Sport sport = sportRepository.findById(request.getSportId())
      .orElseThrow(() -> new AppException(ErrorCode.SPORT_NOT_FOUND));

    if (!storeHasSportRepository.existsBySportIdAndStoreId(request.getSportId(), request.getStoreId())) {
      throw new AppException(ErrorCode.STORE_NOT_HAS_SPORT);
    }

    Rating rating = ratingMapper.fromRequest(request);
    rating.setUser(current);
    rating.setSport(sport);
    rating.setStore(store);
    rating = ratingRepository.save(rating);

    ratingMediaService.createMultiple(rating, medias);
    recalcAverageRating(rating);

    return ratingMapper.toResponse(rating);
  }

  @Override
  public RatingRequest update(RatingRequest request, User current) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'update'");
  }

  @Override
  public List<RatingResponse> getPageRatingForStore(SearchRatingRequest request, int page, int perPage) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'getPageRatingForStore'");
  }

  @Override
  public RatingResponse getById(String id) {
    return ratingRepository.findById(id).map(ratingMapper::toResponse)
      .orElseThrow(() -> new AppException(ErrorCode.RATING_NOT_EXISTS));
  }

  @Override
  public void delete(String ratingId, User current) {
    Rating rating = ratingRepository.findById(ratingId)
      .orElseThrow(() -> new AppException(ErrorCode.RATING_NOT_EXISTS));

    if (!rating.getUser().getId().equals(current.getId())) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    recalcAverageRatingAfterDelete(rating);
    ratingRepository.delete(rating);
  }

  private void recalcAverageRatingAfterDelete(Rating rating) {
    Store store = rating.getStore();
    Sport sport = rating.getSport();
    int star = rating.getStar();

    List<RatingStoreSport> allRatings = ratingStoreSportRepository.findByStoreId(store.getId());
    RatingStoreSport currentRating = findOrThrowException(allRatings, sport);
    decreaseRating(currentRating, star);

    updateAverageRating(store, allRatings);
  }

  private void recalcAverageRating(Rating rating) {
    Store store = rating.getStore();
    Sport sport = rating.getSport();
    int star = rating.getStar();

    List<RatingStoreSport> allRatings = ratingStoreSportRepository.findByStoreId(store.getId());
    RatingStoreSport currentRating = findOrCreateRatingForSport(allRatings, store, sport);
    increaseRating(currentRating, star);

    if (!allRatings.contains(currentRating)) {
      allRatings.add(currentRating);
    }

    updateAverageRating(store, allRatings);
  }

  private RatingStoreSport findOrCreateRatingForSport(
    List<RatingStoreSport> ratingStoreSports, Store store, Sport sport
  ) {
    return ratingStoreSports.stream()
      .filter(rating -> rating.getSport().getId().equals(sport.getId()))
      .findFirst()
      .orElseGet(() -> RatingStoreSport.builder()
        .sport(sport)
        .store(store)
        .build());
  }

  private RatingStoreSport findOrThrowException(
    List<RatingStoreSport> ratingStoreSports, Sport sport
  ) {
    return ratingStoreSports.stream()
      .filter(rating -> rating.getSport().getId().equals(sport.getId()))
      .findFirst()
      .orElseThrow(() -> new AppException(ErrorCode.RATING_NOT_EXISTS));
  }

  private void increaseRating(RatingStoreSport ratingStoreSport, long score) {
    ratingStoreSport.increaseRatingCount();
    ratingStoreSport.increaseRatingScore(score);
    ratingStoreSportRepository.save(ratingStoreSport);
  }

  private void decreaseRating(RatingStoreSport ratingStoreSport, long score) {
    ratingStoreSport.decreaseRatingCount();
    ratingStoreSport.decreaseRatingScore(score);
    ratingStoreSportRepository.save(ratingStoreSport);
  }

  private void updateAverageRating(Store store, List<RatingStoreSport> allRatings) {
    long totalScore = allRatings.stream()
      .mapToLong(RatingStoreSport::getRatingScore)
      .sum();

    long totalRating = allRatings.stream()
      .mapToLong(RatingStoreSport::getRatingCount)
      .sum();

    float average = (float) ((totalRating == 0) ? 0.0 : (float) totalScore / totalRating);
    store.setAverageRating(average);
    storeRepository.save(store);
  }
}
