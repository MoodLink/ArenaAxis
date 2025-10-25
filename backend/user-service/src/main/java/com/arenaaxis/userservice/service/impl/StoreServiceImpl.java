package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.request.SearchStoreRequest;
import com.arenaaxis.userservice.dto.request.StoreCreateRequest;
import com.arenaaxis.userservice.dto.response.StoreAdminDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreClientDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.entity.StoreViewHistory;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.entity.Ward;
import com.arenaaxis.userservice.entity.enums.Role;
import com.arenaaxis.userservice.entity.enums.StoreImageType;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.mapper.StoreMapper;
import com.arenaaxis.userservice.mapper.WardRepository;
import com.arenaaxis.userservice.repository.StoreRepository;
import com.arenaaxis.userservice.repository.StoreViewHistoryRepository;
import com.arenaaxis.userservice.repository.UserRepository;
import com.arenaaxis.userservice.service.AuthenticationService;
import com.arenaaxis.userservice.service.MediaService;
import com.arenaaxis.userservice.service.StoreService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreServiceImpl implements StoreService {
  StoreRepository storeRepository;
  UserRepository userRepository;
  WardRepository wardRepository;
  StoreMapper storeMapper;
  MediaService mediaService;
  StoreViewHistoryRepository storeViewHistoryRepository;
  AuthenticationService authenticationService;

  @Override
  @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_CLIENT')")
  public StoreAdminDetailResponse create(StoreCreateRequest request, User owner)
    throws ParseException, JOSEException {
    Ward ward = getWard(request.getWardId());

    Store store = storeMapper.fromCreateRequest(request);
    String newToken = authenticationService.buildTokenWhenUpgradeUser(owner);

    store.setOwner(userRepository.findById(owner.getId())
      .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    store.setWard(ward);
    store.setProvince(ward.getProvince());
    store = storeRepository.save(store);

    return storeMapper.toAdminDetailResponse(store, newToken);
  }

  @Override
  @PreAuthorize("hasRole('ROLE_CLIENT')")
  @PostAuthorize("returnObject.owner.email == authentication.name")
  public StoreAdminDetailResponse updateImage(String storeId, Map<StoreImageType, List<MultipartFile>> images) {
    Store store = storeRepository.findById(storeId)
      .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

    images.forEach((type, files) -> {
      if (files == null) return;

      if (type == StoreImageType.MEDIAS) {
        mediaService.uploadMultipleMedias(store, files);
      } else {
        MultipartFile file = files.get(0);
        mediaService.uploadImagesStore(store, type, file);
      }
    });

    return storeMapper.toAdminDetailResponse(store);
  }

  @Override
  public StoreAdminDetailResponse update(StoreCreateRequest request, User owner) {
    return null;
  }

  @Override
  public StoreClientDetailResponse detail(String storeId, User currentUser) {
    Store store = storeRepository.findById(storeId)
      .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

    if (shouldIncreaseView(currentUser)) {
      increaseViewCount(store);
    }

    if (shouldSaveHistory(currentUser)) {
      saveStoreViewHistory(store, currentUser);
    }

    return storeMapper.toClientDetailResponse(store);
  }

  @Override
  public StoreAdminDetailResponse toggleActiveStatus(String storeId) {
    return null;
  }

  @Override
  public List<StoreSearchItemResponse> getInPagination(int page, int perPage) {
    Pageable pageable = PageRequest.of(page - 1, perPage);
    Page<Store> storePage = storeRepository.findAll(pageable);

    return storePage.getContent().stream()
      .map(storeMapper::toStoreSearchItemResponse)
      .toList();
  }

  @Override
  public List<StoreSearchItemResponse> searchInPagination(
    SearchStoreRequest request, int page, int perPage
  ) {

    return List.of();
  }

  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CLIENT')")
  public List<StoreAdminDetailResponse> getStoresByOwnerId(String ownerId, User currentUser) {
    if (!currentUser.getId().equals(ownerId) && !currentUser.getRole().isAdmin()) {
      throw  new AppException(ErrorCode.UNAUTHENTICATED);
    }

    return storeRepository.findByOwner_Id(ownerId)
      .stream()
      .map(storeMapper::toAdminDetailResponse)
      .toList();
  }

  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CLIENT')")
  public StoreAdminDetailResponse fullInfo(String storeId) {
    Store store = storeRepository.findById(storeId)
      .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
    return storeMapper.toAdminDetailResponse(store);
  }

  private Ward getWard(String wardId) {
    return wardRepository.findById(wardId)
                         .orElseThrow(() -> new AppException(ErrorCode.WARD_NOT_FOUND));
  }

  private boolean shouldIncreaseView(User currentUser) {
    return currentUser == null || currentUser.getRole() == Role.USER;
  }

  private boolean shouldSaveHistory(User currentUser) {
    return Objects.requireNonNull(currentUser).getRole() == Role.USER;
  }

  private void increaseViewCount(Store store) {
    store.setViewCount(store.getViewCount() + 1);
    storeRepository.save(store);
  }

  private void saveStoreViewHistory(Store store, User currentUser) {
    StoreViewHistory storeViewHistory = StoreViewHistory.builder()
      .user(currentUser)
      .store(store)
      .build();
    storeViewHistoryRepository.save(storeViewHistory);
  }
}