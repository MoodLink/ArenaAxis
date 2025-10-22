package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.request.SubscriptionRequest;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.service.CurrentUserService;
import com.arenaaxis.userservice.service.SubscriptionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/subscriptions")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubscriptionController {
  CurrentUserService currentUserService;
  SubscriptionService subscriptionService;

  @PostMapping("/main-plan")
  ResponseEntity<Void> subscribeMainPlan(@RequestBody @Validated SubscriptionRequest request) {
    User current = currentUserService.getCurrentUser();
    subscriptionService.subscribeMainPlan(request, current);
    return ResponseEntity.ok().build();
  }
}
