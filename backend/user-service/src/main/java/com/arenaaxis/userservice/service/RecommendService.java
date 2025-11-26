package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.NearbyRequest;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;

import java.util.List;

public interface RecommendService {
  List<StoreSearchItemResponse> nearByRecommend(NearbyRequest request);
}
