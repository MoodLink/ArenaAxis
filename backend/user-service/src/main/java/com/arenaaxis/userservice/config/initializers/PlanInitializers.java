package com.arenaaxis.userservice.config.initializers;

import com.arenaaxis.userservice.config.yaml.MainPlanConfig;
import com.arenaaxis.userservice.repository.MainPlanRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PlanInitializers implements CommandLineRunner {
  MainPlanRepository mainPlanRepository;
  MainPlanConfig mainPlanConfig;

  void initMainPlan() {
    mainPlanConfig.getMainPlans().forEach(plan -> {
      if (!mainPlanRepository.existsById(plan.getId())) {
        mainPlanRepository.save(plan);
      }
    });
  }

  @Override
  public void run(String... args) throws Exception {
    initMainPlan();
  }
}
