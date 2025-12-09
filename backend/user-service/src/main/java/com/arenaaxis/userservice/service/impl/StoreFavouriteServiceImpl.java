package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.response.StoreClientDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.entity.StoreFavourite;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.mapper.StoreMapper;
import com.arenaaxis.userservice.repository.StoreFavouriteRepository;
import com.arenaaxis.userservice.repository.StoreRepository;
import com.arenaaxis.userservice.repository.UserRepository;
import com.arenaaxis.userservice.service.StoreFavouriteService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreFavouriteServiceImpl implements StoreFavouriteService {
  StoreFavouriteRepository storeFavouriteRepository;
  UserRepository userRepository;
  StoreRepository storeRepository;
  StoreMapper storeMapper;

  @Override
  @Transactional
  public StoreClientDetailResponse createFavourite(String storeId, User currentUser) {
    if (storeFavouriteRepository.existsByStoreIdAndUserId(storeId, currentUser.getId())) {
      throw new AppException(ErrorCode.FAVOURITE_ALREADY_EXISTED);
    }

    Store store = storeRepository.findById(storeId)
      .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
    User user = userRepository.findById(currentUser.getId())
      .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    StoreFavourite storeFavourite = StoreFavourite.builder().store(store).user(user).build();
    storeFavouriteRepository.save(storeFavourite);

    return storeMapper.toClientDetailResponse(store);
  }

  @Override
  public List<StoreSearchItemResponse> getFavourites(User currentUser) {
    return storeFavouriteRepository.findByUserId(currentUser.getId())
      .stream()
      .map(StoreFavourite::getStore)
      .map(storeMapper::toStoreSearchItemResponse)
      .toList();
  }

  @Override
  @Transactional
  public void deleteFavouriteByStoreIdAndUser(String storeId, User currentUser) {
    storeFavouriteRepository.deleteByStoreIdAndUserId(storeId, currentUser.getId());
  }

  @Override
  @Transactional
  public void deleteFavouriteByUser(User currentUser) {
    storeFavouriteRepository.deleteByUserId(currentUser.getId());
  }

  @Override
  @Transactional
  public void deleteFavouriteByStoreIdsAndUser(List<String> ids, User currentUser) {
    storeFavouriteRepository.deleteByStoreIdsAndUserId(ids, currentUser.getId());
  }
}
