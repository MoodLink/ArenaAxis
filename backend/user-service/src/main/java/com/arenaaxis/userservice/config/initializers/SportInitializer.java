package com.arenaaxis.userservice.config.initializers;

import com.arenaaxis.userservice.config.yaml.SportConfig;
import com.arenaaxis.userservice.repository.SportRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SportInitializer implements CommandLineRunner {
  SportConfig sportConfig;
  SportRepository sportRepository;

  @Override
  public void run(String... args) throws Exception {
    sportConfig.getSports().forEach(sport -> {
      if (!sportRepository.existsById(sport.getId())) {
        sportRepository.save(sport);
      }
    });
  }
}
