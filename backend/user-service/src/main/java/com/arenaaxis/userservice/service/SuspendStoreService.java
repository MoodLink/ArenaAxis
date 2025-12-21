package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.SearchSuspendStoreRequest;
import com.arenaaxis.userservice.dto.request.SuspendStoreRequest;
import com.arenaaxis.userservice.dto.response.SuspendStoreResponse;
import com.arenaaxis.userservice.entity.User;

import java.time.LocalDate;
import java.util.List;

public interface SuspendStoreService {
  SuspendStoreResponse suspendStore(SuspendStoreRequest request, User current);
  SuspendStoreResponse updateSuspend(String suspendId, SuspendStoreRequest request, User current);
  List<SuspendStoreResponse> getAllSuspendStores(SearchSuspendStoreRequest request, User current);
  Boolean checkSuspend(String storeId, LocalDate date);
}
