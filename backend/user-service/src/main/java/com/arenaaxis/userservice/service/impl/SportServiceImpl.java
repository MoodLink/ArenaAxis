package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.request.SportCreateRequest;
import com.arenaaxis.userservice.dto.request.SportUpdateRequest;
import com.arenaaxis.userservice.dto.response.SportResponse;
import com.arenaaxis.userservice.entity.Sport;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.mapper.SportMapper;
import com.arenaaxis.userservice.repository.SportRepository;
import com.arenaaxis.userservice.service.SportService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SportServiceImpl implements SportService {
  SportRepository sportRepository;
  SportMapper sportMapper;

  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public SportResponse create(SportCreateRequest request) {
    Sport sport = sportMapper.toSport(request);
    sport = sportRepository.save(sport);
    return sportMapper.toResponse(sport);
  }

  @Override
  public SportResponse getSportById(String id) {
    Sport sport = sportRepository.findById(id)
      .orElseThrow(() -> new AppException(ErrorCode.SPORT_NOT_FOUND));
    return sportMapper.toResponse(sport);
  }

  @Override
  public List<SportResponse> getAllSports() {
    return sportRepository.findAll().stream().map(sportMapper::toResponse).toList();
  }

  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public SportResponse update(String id, SportUpdateRequest request) {
    Sport sport = sportRepository.findById(id)
      .orElseThrow(() -> new AppException(ErrorCode.SPORT_NOT_FOUND));
    sportMapper.toSport(sport, request);
    return sportMapper.toResponse(sport);
  }
}
