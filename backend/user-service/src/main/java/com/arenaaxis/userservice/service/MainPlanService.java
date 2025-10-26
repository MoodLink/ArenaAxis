package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.response.MainPlanResponse;

import java.util.List;

public interface MainPlanService {
  List<MainPlanResponse> getAllMainPlan();
  MainPlanResponse getMainPlanById(String id);
}
