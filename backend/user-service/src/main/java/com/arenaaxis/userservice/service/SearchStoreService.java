package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.SearchStoreRequest;
import com.arenaaxis.userservice.entity.Store;

import java.util.List;

public interface SearchStoreService {
  List<Store> search(SearchStoreRequest request, int page, int perPage);
}
