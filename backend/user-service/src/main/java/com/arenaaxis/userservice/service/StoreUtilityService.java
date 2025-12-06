package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.entity.StoreUtility;
import com.arenaaxis.userservice.entity.enums.UtilityType;

import java.util.List;

public interface StoreUtilityService {
  List<StoreUtility> createUtilitiesForStore(Store store, List<UtilityType> types);
}
