package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.response.StoreClientDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.entity.User;

import java.util.List;

public interface StoreFavouriteService {
  StoreClientDetailResponse createFavourite(String storeId, User currentUser);
  List<StoreSearchItemResponse> getFavourites(User currentUser);
  void deleteFavouriteByStoreIdAndUser(String storeId, User currentUser);
  void deleteFavouriteByUser(User currentUser);
  void deleteFavouriteByStoreIdsAndUser(List<String> ids, User currentUser);
}
