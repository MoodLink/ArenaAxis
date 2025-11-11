package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.request.FieldCreateRequest;
import com.arenaaxis.userservice.dto.response.FieldResponse;
import com.arenaaxis.userservice.entity.Field;
import com.arenaaxis.userservice.entity.Sport;
import com.arenaaxis.userservice.repository.FieldRepository;
import com.arenaaxis.userservice.repository.SportRepository;
import com.arenaaxis.userservice.utility.FieldService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FieldServiceImpl implements FieldService {
  FieldRepository fieldRepository;
  SportRepository sportRepository;

  @Override
  public FieldResponse create(FieldCreateRequest request) {
    Sport sport = getSport(request.getSportId());

    Field field = null;
    return null;
  }

  private Sport getSport(String sportId) {
    return sportRepository.findById(sportId).orElse(null);
  }
}
