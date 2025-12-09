package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.entity.StoreUtility;
import com.arenaaxis.userservice.entity.enums.UtilityType;
import com.arenaaxis.userservice.repository.StoreUtilityRepository;
import com.arenaaxis.userservice.service.StoreUtilityService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreUtilityServiceImpl implements StoreUtilityService {
  StoreUtilityRepository storeUtilityRepository;

  @Override
  public List<StoreUtility> createUtilitiesForStore(Store store, List<UtilityType> types) {
    return types.stream().map(type -> {
      StoreUtility utility = StoreUtility.builder()
        .store(store)
        .type(type)
        .build();
      utility = storeUtilityRepository.save(utility);
      return utility;
    }).toList();
  }
}
