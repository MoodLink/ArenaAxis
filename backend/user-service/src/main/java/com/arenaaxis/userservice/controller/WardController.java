package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.response.WardResponse;
import com.arenaaxis.userservice.service.WardService;
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
@RequestMapping("/wards")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WardController {
  WardService wardService;

  @GetMapping
  public ResponseEntity<List<WardResponse>> getAll() {
    return ResponseEntity.ok(wardService.getAllWards());
  }

  @GetMapping("/{id}")
  public ResponseEntity<WardResponse> getById(@PathVariable String id) {
    return ResponseEntity.ok(wardService.getWardById(id));
  }
}
