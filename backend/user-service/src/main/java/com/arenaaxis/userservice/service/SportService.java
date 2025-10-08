package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.SportCreateRequest;
import com.arenaaxis.userservice.dto.request.SportUpdateRequest;
import com.arenaaxis.userservice.dto.response.SportResponse;

import java.util.List;

public interface SportService {
  SportResponse create(SportCreateRequest request);
  SportResponse getSportById(String id);
  List<SportResponse> getAllSports();
  SportResponse update(String sportId, SportUpdateRequest request);
}
