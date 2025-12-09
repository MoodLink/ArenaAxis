package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.UpdateSportForStoreRequest;
import com.arenaaxis.userservice.entity.Sport;

import java.util.List;

public interface StoreHasSportService {
  void updateSportForStore(UpdateSportForStoreRequest request);
  List<Sport> getSportByStoreId(String storeId);
}
