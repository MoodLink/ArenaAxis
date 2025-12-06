package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.request.NearbyRequest;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.service.RecommendService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommends")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RecommendController {
  RecommendService recommendService;

  @PostMapping("/near-by")
  public ResponseEntity<List<StoreSearchItemResponse>> nearbyRecommend(@RequestBody NearbyRequest request) {
    return ResponseEntity.ok(recommendService.nearByRecommend(request));
  }
}
