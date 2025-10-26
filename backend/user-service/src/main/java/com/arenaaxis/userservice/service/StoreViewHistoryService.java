package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.entity.User;

import java.util.List;

public interface StoreViewHistoryService {
  List<StoreSearchItemResponse> getByUserId(User currentUser);
  void deleteByStoreIdAndUserId(String storeId, User currentUser);
  void deleteAllByUserId(User currentUser);
  void deleteByStoreIdsAndUser(List<String> ids, User currentUser);
}
