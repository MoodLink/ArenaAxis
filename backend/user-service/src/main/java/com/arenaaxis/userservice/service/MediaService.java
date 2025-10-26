package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.entity.Bank;
import com.arenaaxis.userservice.entity.Media;
import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.entity.StoreMedia;
import com.arenaaxis.userservice.entity.enums.StoreImageType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MediaService {
  void uploadAndUpdateLogoToBank(Bank bank, MultipartFile logo);
  void deleteBankLogo(Bank bank);
  void uploadImagesStore(Store store, StoreImageType type, MultipartFile file);

  @Async
  void uploadMultipleMedias(Store store, List<MultipartFile> files);

  @Async
  void deleteStoreMedia(StoreMedia media);
}