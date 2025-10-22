package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.SearchStoreRequest;
import com.arenaaxis.userservice.dto.response.StoreAdminDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;

import java.util.List;

public interface SearchStoreService {
  List<StoreAdminDetailResponse> adminSearch(SearchStoreRequest request, int page, int perPage);
  List<StoreSearchItemResponse> clientSearch(SearchStoreRequest request, int page, int perPage);
}
