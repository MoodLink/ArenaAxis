package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.response.ProvinceResponse;
import com.arenaaxis.userservice.dto.response.WardResponse;
import com.arenaaxis.userservice.entity.Province;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.mapper.ProvinceMapper;
import com.arenaaxis.userservice.mapper.ProvinceRepository;
import com.arenaaxis.userservice.mapper.WardMapper;
import com.arenaaxis.userservice.service.ProvinceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProvinceServiceImpl implements ProvinceService {
  ProvinceRepository provinceRepository;
  ProvinceMapper provinceMapper;

  WardMapper wardMapper;

  @Override
  public List<ProvinceResponse> getAllProvinces() {
    return provinceRepository.findAll().stream().map(provinceMapper::toResponse).toList();
  }

  @Override
  public ProvinceResponse getProvinceById(String id) {
    return provinceRepository.findById(id).map(provinceMapper::toResponse)
      .orElseThrow(() -> new AppException(ErrorCode.PROVINCE_NOT_FOUND));
  }

  @Override
  public List<WardResponse> getWardsByProvinceId(String provinceId) {
    Province province = provinceRepository.findById(provinceId)
      .orElseThrow(() -> new AppException(ErrorCode.PROVINCE_NOT_FOUND));

    return province.getWards().stream().map(wardMapper::toResponse).toList();
  }
}
