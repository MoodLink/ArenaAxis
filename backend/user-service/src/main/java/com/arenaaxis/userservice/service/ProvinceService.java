package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.response.ProvinceResponse;
import com.arenaaxis.userservice.dto.response.WardResponse;

import java.util.List;

public interface ProvinceService {
  List<ProvinceResponse> getAllProvinces();
  ProvinceResponse getProvinceById(String id);
  List<WardResponse> getWardsByProvinceId(String provinceId);
}
