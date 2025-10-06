package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.request.SportCreateRequest;
import com.arenaaxis.userservice.dto.request.SportUpdateRequest;
import com.arenaaxis.userservice.dto.response.SportResponse;
import com.arenaaxis.userservice.service.SportService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sports")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SportController {
  SportService sportService;

  @PostMapping
  public ResponseEntity<SportResponse> create(@RequestBody SportCreateRequest request) {
    return ResponseEntity.ok(sportService.create(request));
  }

  @GetMapping
  public ResponseEntity<List<SportResponse>> getAll() {
    return ResponseEntity.ok(sportService.getAllSports());
  }

  @GetMapping("/{id}")
  public ResponseEntity<SportResponse> getById(@PathVariable String id) {
    return ResponseEntity.ok(sportService.getSportById(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<SportResponse> update(
    @PathVariable String id,
    @RequestBody SportUpdateRequest request
  ) {
    return ResponseEntity.ok(sportService.update(id, request));
  }
}
