package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.response.WardResponse;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.mapper.WardMapper;
import com.arenaaxis.userservice.mapper.WardRepository;
import com.arenaaxis.userservice.service.WardService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WardServiceImpl implements WardService {
  WardRepository wardRepository;
  WardMapper wardMapper;

  @Override
  public List<WardResponse> getAllWards() {
    return wardRepository.findAll().stream().map(wardMapper::toResponse).toList();
  }

  @Override
  public WardResponse getWardById(String id) {
    return wardRepository.findById(id).map(wardMapper::toResponse)
      .orElseThrow(() -> new AppException(ErrorCode.WARD_NOT_FOUND));
  }
}
