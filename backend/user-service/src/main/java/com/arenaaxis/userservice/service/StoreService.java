package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.SearchStoreRequest;
import com.arenaaxis.userservice.dto.request.StoreCreateRequest;
import com.arenaaxis.userservice.dto.response.StoreAdminDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreClientDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.entity.User;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;
import java.util.List;

public interface StoreService {
  StoreAdminDetailResponse create(StoreCreateRequest request, User owner) throws ParseException, JOSEException;
  StoreAdminDetailResponse update(StoreCreateRequest request, User owner);
  StoreClientDetailResponse detail(String storeId, User currentUser);
  StoreAdminDetailResponse toggleActiveStatus(String storeId);
  List<StoreSearchItemResponse> getInPagination(int page, int perPage);
  List<StoreSearchItemResponse> searchInPagination(SearchStoreRequest request, int page, int perPage);
}
