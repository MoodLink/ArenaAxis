package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.entity.Bank;
import com.arenaaxis.userservice.entity.Media;
import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.entity.StoreMedia;
import com.arenaaxis.userservice.entity.enums.StoreImageType;
import com.arenaaxis.userservice.repository.BankRepository;
import com.arenaaxis.userservice.repository.MediaRepository;
import com.arenaaxis.userservice.repository.StoreMediaRepository;
import com.arenaaxis.userservice.repository.StoreRepository;
import com.arenaaxis.userservice.service.MediaService;
import com.arenaaxis.userservice.utility.MediaUtility;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MediaServiceImpl implements MediaService {
  BankRepository bankRepository;
  MediaRepository mediaRepository;
  StoreMediaRepository storeMediaRepository;
  MediaUtility mediaUtility;
  StoreRepository storeRepository;

  @Async
  @Override
  public void uploadAndUpdateLogoToBank(Bank bank, @NotNull MultipartFile logoFile) {
    if (bank.getLogo() != null) {
      mediaUtility.delete(bank.getLogo());
    }

    Media logo = createMedia(logoFile);
    bank.setLogo(logo);
    bankRepository.save(bank);
  }

  @Async
  @Override
  public void deleteBankLogo(Bank bank) {
    if (bank.getLogo() == null) return;

    delete(bank.getLogo());
  }

  @Override
  public void delete(Media media) {
    if (media == null) return;

    mediaRepository.delete(media);
    mediaUtility.delete(media);
  }

  @Async
  @Override
  public void uploadImagesStore(Store store, StoreImageType type, MultipartFile file) {
    if (file == null) return;

    Media media = createMedia(file);
    switch (type) {
      case AVATAR -> {
        if (store.getAvatar() != null) delete(store.getAvatar());
        store.setAvatar(media);
      }
      case COVER -> {
        if (store.getCoverImage() != null) delete(store.getCoverImage());
        store.setCoverImage(media);
      }
      case LICENSE -> {
        if (store.getBusinessLicenseImage() != null)
          delete(store.getBusinessLicenseImage());
        store.setBusinessLicenseImage(media);
      }
      case MEDIAS -> {
        createStoreMedia(store, media);
        return;
      }
    }

    storeRepository.save(store);
  }

  @Async
  @Override
  public void uploadMultipleMedias(Store store, List<MultipartFile> files) {
    if (files == null || files.isEmpty()) return;
    files.forEach(file -> {
      Media media = createMedia(file);
      createStoreMedia(store, media);
    });
  }

  @Async
  @Override
  public void deleteStoreMedia(StoreMedia storeMedia) {
    delete(storeMedia.getMedia());
    storeMediaRepository.delete(storeMedia);
  }

  private void createStoreMedia(Store store, Media media) {
    StoreMedia storeMedia = StoreMedia.builder()
      .media(media)
      .store(store)
      .build();
    storeMediaRepository.save(storeMedia);
  }

  private Media createMedia(MultipartFile file) {
    if (file == null) return null;

    Media media = mediaUtility.upload(file);
    return mediaRepository.save(media);
  }
}
