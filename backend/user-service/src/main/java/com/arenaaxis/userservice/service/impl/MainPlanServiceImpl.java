package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.response.MainPlanResponse;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.mapper.MainPlanMapper;
import com.arenaaxis.userservice.repository.MainPlanRepository;
import com.arenaaxis.userservice.service.MainPlanService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MainPlanServiceImpl implements MainPlanService {
  MainPlanRepository mainPlanRepository;
  MainPlanMapper mainPlanMapper;

  @Override
  public List<MainPlanResponse> getAllMainPlan() {
    return mainPlanRepository.findAll().stream().map(mainPlanMapper::toResponse).toList();
  }

  @Override
  public MainPlanResponse getMainPlanById(String id) {
    return mainPlanRepository.findById(id).map(mainPlanMapper::toResponse)
      .orElseThrow(() -> new AppException(ErrorCode.MAIN_PLAN_NOT_FOUND));
  }
}
