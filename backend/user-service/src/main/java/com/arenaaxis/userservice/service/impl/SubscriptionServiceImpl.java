package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.request.SubscriptionRequest;
import com.arenaaxis.userservice.entity.MainPlan;
import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.repository.MainPlanRepository;
import com.arenaaxis.userservice.repository.StoreRepository;
import com.arenaaxis.userservice.service.SubscriptionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubscriptionServiceImpl implements SubscriptionService {
  StoreRepository storeRepository;
  MainPlanRepository mainPlanRepository;

  @Override
  @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
  public void subscribeMainPlan(SubscriptionRequest request, User current) {
    Store store = storeRepository.findById(request.getStoreId())
      .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

    if (!current.getRole().isAdmin()) {
      if (!Objects.equals(store.getOwner().getId(), current.getId())) {
        throw new AppException(ErrorCode.UNAUTHENTICATED);
      }
    }

    MainPlan mainPlan = mainPlanRepository.findById(request.getMainPlanId())
      .orElseThrow(() -> new AppException(ErrorCode.MAIN_PLAN_NOT_FOUND));
    store.setPlan(mainPlan);
    storeRepository.save(store);
  }

  @Override
  public void unsubscribeMainPlan(String storeId, String planId) {

  }

  @Override
  public void subscribeOptionalPlans(String storeId, List<String> optionalPlanIds, User current) {

  }

  @Override
  public void unsubscribeOptionalPlans(String storeId, List<String> optionalPlanIds, User current) {

  }
}
