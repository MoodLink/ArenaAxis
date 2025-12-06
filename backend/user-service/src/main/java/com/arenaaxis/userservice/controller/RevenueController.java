package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.client.api.OrderApi;
import com.arenaaxis.userservice.client.dto.request.OrdersByStoreRequest;
import com.arenaaxis.userservice.client.dto.response.OrderClientResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/revenues")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RevenueController {
  OrderApi orderApi;

  @GetMapping("/store/{storeId}")
  public ResponseEntity<List<OrderClientResponse>> getRevenues(
    @PathVariable("storeId") String storeId,
    @ModelAttribute OrdersByStoreRequest request) {
    request.setStoreId(storeId);
    return ResponseEntity.ok(orderApi.getOrdersByStore(request));
  }
}
