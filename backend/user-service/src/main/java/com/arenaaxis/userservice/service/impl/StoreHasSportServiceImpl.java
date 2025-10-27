package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.request.UpdateSportForStoreRequest;
import com.arenaaxis.userservice.entity.Sport;
import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.entity.StoreHasSport;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.repository.SportRepository;
import com.arenaaxis.userservice.repository.StoreHasSportRepository;
import com.arenaaxis.userservice.repository.StoreRepository;
import com.arenaaxis.userservice.service.StoreHasSportService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreHasSportServiceImpl implements StoreHasSportService {
  StoreHasSportRepository storeHasSportRepository;
  StoreRepository storeRepository;
  SportRepository sportRepository;

  @Override
  public void updateSportForStore(UpdateSportForStoreRequest request) {
    Store store = storeRepository.findById(request.getStoreId())
      .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
    Sport sport = sportRepository.findById(request.getSportId())
      .orElseThrow(() -> new AppException(ErrorCode.SPORT_NOT_FOUND));
    StoreHasSport storeHasSport = storeHasSportRepository
      .findBySportIdAndStoreId(request.getSportId(), request.getStoreId())
      .orElseGet(() -> StoreHasSport.builder()
        .sport(sport)
        .store(store)
        .build());

    storeHasSport.setHasSport(request.isHasSport());
    storeHasSportRepository.save(storeHasSport);
  }
}
