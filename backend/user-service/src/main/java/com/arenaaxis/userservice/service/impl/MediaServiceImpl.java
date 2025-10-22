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
import java.util.Objects;

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

    Media logo = bank.getLogo();
    bank.setLogo(null);
    mediaRepository.delete(logo);
    mediaUtility.delete(logo);
  }

  @Async
  @Override
  public void uploadImagesStore(Store store, StoreImageType type, MultipartFile file) {
    if (file == null) return;

    Media media = createMedia(file);
    if (Objects.requireNonNull(type) == StoreImageType.MEDIAS) {
      createStoreMedia(store, media);
    } else {
      handleSingleStoreMedia(store, type, media);
    }
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
    mediaUtility.delete(storeMedia.getMedia());
    mediaRepository.delete(storeMedia.getMedia());
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

  private void handleSingleStoreMedia(Store store, StoreImageType type, Media newMedia) {
    Media currentMedia = getCurrentMedia(store, type);
    if (currentMedia != null) removeCurrentMedia(store, type, currentMedia);

    setNewMedia(store, type, newMedia);
  }

  private Media getCurrentMedia(Store store, StoreImageType type) {
    return switch (type) {
      case AVATAR -> store.getAvatar();
      case COVER -> store.getCoverImage();
      case LICENSE -> store.getBusinessLicenseImage();
      default -> null;
    };
  }

  private void removeCurrentMedia(Store store, StoreImageType type, Media media) {
    setNewMedia(store, type, null);
    mediaUtility.delete(media);
    mediaRepository.delete(media);
  }

  private void setNewMedia(Store store, StoreImageType type, Media media) {
    switch (type) {
      case AVATAR -> store.setAvatar(media);
      case COVER -> store.setCoverImage(media);
      case LICENSE -> store.setBusinessLicenseImage(media);
    }

    storeRepository.save(store);
  }
}
