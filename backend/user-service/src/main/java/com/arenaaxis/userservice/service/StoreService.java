package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.SearchStoreAdminRequest;
import com.arenaaxis.userservice.dto.request.SearchStoreRequest;
import com.arenaaxis.userservice.dto.request.StoreCreateRequest;
import com.arenaaxis.userservice.dto.request.StoreUpdateRequest;
import com.arenaaxis.userservice.dto.response.StoreAdminDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreAdminSearchItemResponse;
import com.arenaaxis.userservice.dto.response.StoreClientDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.entity.enums.StoreImageType;
import com.nimbusds.jose.JOSEException;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

public interface StoreService {
  StoreAdminDetailResponse create(StoreCreateRequest request, User owner) throws ParseException, JOSEException;
  StoreAdminDetailResponse updateImage(String storeId, Map<StoreImageType, List<MultipartFile>> images);
  StoreAdminDetailResponse update(String id, StoreUpdateRequest request, User owner);
  StoreClientDetailResponse detail(String storeId, User currentUser);
  StoreAdminDetailResponse fullInfo(String storeId);
  StoreAdminDetailResponse approveStore(String storeId, User currentUser);
  StoreAdminDetailResponse toggleActiveStatus(String storeId);
  List<StoreSearchItemResponse> getInPagination(int page, int perPage);
  List<StoreSearchItemResponse> searchInPagination(SearchStoreRequest request, int page, int perPage);
  List<StoreAdminDetailResponse> getStoresByOwnerId(String ownerId, User currentUser);
  List<StoreAdminSearchItemResponse> adminSearch(SearchStoreAdminRequest request, int page, int perPage);
  StoreAdminDetailResponse suspendStore(String storeId, User currentUser);
}
