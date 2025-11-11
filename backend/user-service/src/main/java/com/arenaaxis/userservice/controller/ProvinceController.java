package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.response.ProvinceResponse;
import com.arenaaxis.userservice.dto.response.WardResponse;
import com.arenaaxis.userservice.service.ProvinceService;
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
@RequestMapping("/provinces")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProvinceController {
  ProvinceService provinceService;

  @GetMapping
  public ResponseEntity<List<ProvinceResponse>> getAllProvinces() {
    return ResponseEntity.ok(provinceService.getAllProvinces());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProvinceResponse> getProvinceById(@PathVariable("id") String id) {
    return ResponseEntity.ok(provinceService.getProvinceById(id));
  }

  @GetMapping("/{id}/wards")
  public ResponseEntity<List<WardResponse>> getAllWardsByProvinceId(@PathVariable("id") String id) {
    return ResponseEntity.ok(provinceService.getWardsByProvinceId(id));
  }
}
