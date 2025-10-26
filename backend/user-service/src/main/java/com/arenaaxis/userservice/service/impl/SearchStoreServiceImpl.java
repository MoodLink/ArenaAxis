package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.request.SearchStoreRequest;
import com.arenaaxis.userservice.dto.response.StoreAdminDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.repository.StoreRepository;
import com.arenaaxis.userservice.service.SearchStoreService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SearchStoreServiceImpl implements SearchStoreService {
  StoreRepository storeRepository;

  @Override
  public List<StoreAdminDetailResponse> adminSearch(SearchStoreRequest request, int page, int perPage) {
    return List.of();
  }

  @Override
  public List<StoreSearchItemResponse> clientSearch(SearchStoreRequest request, int page, int perPage) {
    return List.of();
  }
}
