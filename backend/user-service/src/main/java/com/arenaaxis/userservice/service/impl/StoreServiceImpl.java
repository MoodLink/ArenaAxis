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
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.mapper.StoreMapper;
import com.arenaaxis.userservice.mapper.WardRepository;
import com.arenaaxis.userservice.repository.StoreRepository;
import com.arenaaxis.userservice.repository.StoreViewHistoryRepository;
import com.arenaaxis.userservice.service.AuthenticationService;
import com.arenaaxis.userservice.service.StoreService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreServiceImpl implements StoreService {
  StoreRepository storeRepository;
  WardRepository wardRepository;
  StoreMapper storeMapper;
  StoreViewHistoryRepository storeViewHistoryRepository;
  AuthenticationService authenticationService;

  @Override
  @PreAuthorize("hasRole('ROLE_USER')")
  public StoreAdminDetailResponse create(StoreCreateRequest request, User owner)
    throws ParseException, JOSEException {
    Ward ward = getWard(request.getWardId());

    Store store = storeMapper.fromCreateRequest(request);
    store.setOwner(owner);
    store.setWard(ward);
    store.setProvince(ward.getProvince());
    store = storeRepository.save(store);

    String newToken = authenticationService.buildTokenWhenUpgradeUser(owner);
    return storeMapper.toAdminDetailResponse(store, newToken);
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
    return List.of();
  }

  @Override
  public List<StoreSearchItemResponse> searchInPagination(
    SearchStoreRequest request, int page, int perPage
  ) {

    return List.of();
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