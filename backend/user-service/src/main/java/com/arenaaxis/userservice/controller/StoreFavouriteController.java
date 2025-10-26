package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.request.FavouriteRequest;
import com.arenaaxis.userservice.dto.response.StoreClientDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.service.CurrentUserService;
import com.arenaaxis.userservice.service.StoreFavouriteService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/favourites")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreFavouriteController {
  CurrentUserService currentUserService;
  StoreFavouriteService storeFavouriteService;

  @GetMapping
  public ResponseEntity<List<StoreSearchItemResponse>> getAllFavourites() {
    User current = currentUserService.getCurrentUser();
    return ResponseEntity.ok(storeFavouriteService.getFavourites(current));
  }

  @PostMapping
  public ResponseEntity<StoreClientDetailResponse> create(@RequestBody FavouriteRequest request) {
    User current = currentUserService.getCurrentUser();
    return ResponseEntity.ok(storeFavouriteService.createFavourite(request.getStoreId(), current));
  }

  @DeleteMapping("/store-id")
  public ResponseEntity<Void> delete(@RequestBody FavouriteRequest request) {
    User current = currentUserService.getCurrentUser();
    storeFavouriteService.deleteFavouriteByStoreIdAndUser(request.getStoreId(), current);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/all")
  public ResponseEntity<Void> deleteAll() {
    User current = currentUserService.getCurrentUser();
    storeFavouriteService.deleteFavouriteByUser(current);
    return ResponseEntity.noContent().build();
  }

//  @DeleteMapping("/multiple")
//  public ResponseEntity<Void> deleteMultiple(@RequestParam("storeIds") List<String> storeIds) {
//    User current = currentUserService.getCurrentUser();
//    storeFavouriteService.deleteFavouriteByStoreIdsAndUser(storeIds, current);
//    return ResponseEntity.noContent().build();
//  }
}
