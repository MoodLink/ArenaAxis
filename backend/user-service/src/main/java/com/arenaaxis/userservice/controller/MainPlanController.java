package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.response.MainPlanResponse;
import com.arenaaxis.userservice.service.MainPlanService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/main-plans")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MainPlanController {
  MainPlanService mainPlanService;

  @GetMapping
  ResponseEntity<List<MainPlanResponse>> getAll() {
    return ResponseEntity.ok(mainPlanService.getAllMainPlan());
  }

  @GetMapping("/{id}")
  ResponseEntity<MainPlanResponse> getById(@PathVariable String id) {
    return ResponseEntity.ok(mainPlanService.getMainPlanById(id));
  }
}
