package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.response.WardResponse;

import java.util.List;

public interface WardService {
  List<WardResponse> getAllWards();
  WardResponse getWardById(String id);
}
