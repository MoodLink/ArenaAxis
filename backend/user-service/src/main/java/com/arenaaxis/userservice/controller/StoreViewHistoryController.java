package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.service.CurrentUserService;
import com.arenaaxis.userservice.service.StoreViewHistoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/store-view-histories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreViewHistoryController {
  CurrentUserService currentUserService;
  StoreViewHistoryService storeViewHistoryService;

  @GetMapping
  ResponseEntity<List<StoreSearchItemResponse>> getMySelf() {
    User current = currentUserService.getCurrentUser();
    return ResponseEntity.ok(storeViewHistoryService.getByUserId(current));
  }

  @DeleteMapping("/all")
  ResponseEntity<Void> deleteAll() {
    User current = currentUserService.getCurrentUser();
    storeViewHistoryService.deleteAllByUserId(current);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/{store-id}")
  ResponseEntity<Void> deleteByStoreId(@PathVariable("store-id") String storeId) {
    User current = currentUserService.getCurrentUser();
    storeViewHistoryService.deleteByStoreIdAndUserId(storeId, current);
    return ResponseEntity.noContent().build();
  }

//  @DeleteMapping("/multiple")
//  ResponseEntity<Void> deleteMultipleByStoreId(@RequestParam("store-ids") List<String> storeIds) {
//    User current = currentUserService.getCurrentUser();
//    storeViewHistoryService.deleteByStoreIdsAndUser(storeIds, current);
//    return ResponseEntity.noContent().build();
//  }
}
