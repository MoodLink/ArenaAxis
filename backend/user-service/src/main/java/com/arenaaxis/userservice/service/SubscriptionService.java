package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.SubscriptionRequest;
import com.arenaaxis.userservice.entity.User;

import java.util.List;

public interface SubscriptionService {
  void subscribeMainPlan(SubscriptionRequest request, User current);
  void unsubscribeMainPlan(String storeId, String planId);
  void subscribeOptionalPlans(String storeId, List<String> optionalPlanIds, User current);
  void unsubscribeOptionalPlans(String storeId, List<String> optionalPlanIds, User current);
}
