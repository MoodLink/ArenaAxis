package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.entity.StoreMedia;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.repository.StoreMediaRepository;
import com.arenaaxis.userservice.service.StoreMediaService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreMediaServiceImpl implements StoreMediaService {
  StoreMediaRepository storeMediaRepository;

  public void delete(String id, User current) {
    StoreMedia storeMedia = storeMediaRepository.findById(id)
      .orElseThrow(() -> new AppException(ErrorCode.STORE_MEDIA_NOT_FOUND));

    if (!storeMedia.getStore().getOwner().getId().equals(current.getId())) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    storeMediaRepository.delete(storeMedia);
  }
}
