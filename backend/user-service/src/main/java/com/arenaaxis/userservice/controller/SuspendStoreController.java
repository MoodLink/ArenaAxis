package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.request.SearchSuspendStoreRequest;
import com.arenaaxis.userservice.dto.request.SuspendStoreRequest;
import com.arenaaxis.userservice.dto.response.SuspendStoreResponse;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.service.CurrentUserService;
import com.arenaaxis.userservice.service.SuspendStoreService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/suspend-stores")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SuspendStoreController {
  SuspendStoreService suspendStoreService;
  CurrentUserService currentUserService;

  @PostMapping
  public ResponseEntity<SuspendStoreResponse> create(@RequestBody SuspendStoreRequest request) {
    User current = currentUserService.getCurrentUser();
    return ResponseEntity.ok(suspendStoreService.suspendStore(request, current));
  }

  @GetMapping("/{storeId}")
  public ResponseEntity<List<SuspendStoreResponse>> getAll(
    @PathVariable String storeId,
    @RequestParam(value = "from", required = false)
    @DateTimeFormat(style = "yyyy/MM/dd")
    LocalDate from,
    @RequestParam(value = "to", required = false)
    @DateTimeFormat(style = "yyyy/MM/dd")
    LocalDate to
  ) {
    User current = currentUserService.getCurrentUser();
    SearchSuspendStoreRequest request = SearchSuspendStoreRequest.builder()
      .from(from)
      .to(to)
      .storeId(storeId)
      .build();
    return ResponseEntity.ok(suspendStoreService.getAllSuspendStores(request, current));
  }

  @PutMapping("/{suspendStoreId}")
  public ResponseEntity<SuspendStoreResponse> update(
    @PathVariable String suspendStoreId,
    @RequestBody SuspendStoreRequest request
  ) {
    User current = currentUserService.getCurrentUser();
    return ResponseEntity.ok(suspendStoreService.updateSuspend(suspendStoreId, request, current));
  }
}
