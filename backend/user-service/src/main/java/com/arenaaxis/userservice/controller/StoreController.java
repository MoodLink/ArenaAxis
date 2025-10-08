package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.request.SearchStoreRequest;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.service.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/stores")
public class StoreController {
  StoreService storeService;

  @GetMapping
  public ResponseEntity<List<StoreSearchItemResponse>> getPageStores(
    @RequestBody SearchStoreRequest searchRequest,
    @RequestParam("page") int page,
    @RequestParam("perPage") int perPage) {
      return null;
  }
}
