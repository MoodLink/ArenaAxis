package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.SearchStoreRequest;
import com.arenaaxis.userservice.dto.response.StoreAdminDetailResponse;

import java.util.List;

public interface SearchStoreService {
  List<StoreAdminDetailResponse> adminSearch(SearchStoreRequest request, int page, int perPage);
  List<StoreAdminDetailResponse> clientSearch(SearchStoreRequest request, int page, int perPage);
}
