package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.request.*;
import com.arenaaxis.userservice.dto.response.*;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.entity.enums.StoreImageType;
import com.arenaaxis.userservice.service.*;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;
import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/stores")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreController {
  StoreService storeService;
  CurrentUserService currentUserService;
  StoreHasSportService storeHasSportService;
  SuspendStoreService suspendStoreService;
  RatingService ratingService;

  @GetMapping
  public ResponseEntity<List<StoreSearchItemResponse>> getPageStores(
    @RequestParam(value = "page", defaultValue = "1") int page,
    @RequestParam(value = "perPage", defaultValue = "12") int perPage) {
    User currentUser = currentUserService.getCurrentUser();
    return ResponseEntity.ok(storeService.getInPagination(currentUser, page, perPage));
  }

  @PostMapping("/search")
  public ResponseEntity<List<StoreSearchItemResponse>> searchPageStores(
    @RequestBody SearchStoreRequest request,
    @RequestParam(value = "page", defaultValue = "1") int page,
    @RequestParam(value = "perPage", defaultValue = "12") int perPage) {
    return ResponseEntity.ok(storeService.searchInPagination(request, page, perPage));
  }

  @PostMapping("/admin-search")
  public ResponseEntity<List<StoreAdminSearchItemResponse>> searchAdmin(
    @RequestBody(required = false) SearchStoreAdminRequest request,
    @RequestParam(value = "page", defaultValue = "1") int page,
    @RequestParam(value = "perPage", defaultValue = "12") int perPage
  ) {
    return ResponseEntity.ok(storeService.adminSearch(request, page, perPage));
  }

  @PostMapping("/approve")
  public ResponseEntity<StoreAdminDetailResponse> approveStore(@RequestBody ApproveStoreRequest request) {
    User current = currentUserService.getCurrentUser();
    return ResponseEntity.ok(storeService.approveStore(request.getStoreId(), current));
  }

  @PostMapping
  public ResponseEntity<StoreAdminDetailResponse> addStore(@Validated @RequestBody StoreCreateRequest request)
    throws ParseException, JOSEException {
    User user = currentUserService.getCurrentUser();
    return ResponseEntity.ok(storeService.create(request, user));
  }

  @PutMapping("/{id}/images")
  public ResponseEntity<StoreAdminDetailResponse> updateImages(
    @PathVariable("id") String id,
    @RequestParam(value = "avatar", required = false) MultipartFile  avatar,
    @RequestParam(value = "coverImage", required = false) MultipartFile  coverImage,
    @RequestParam(value = "businessLicenceImage", required = false) MultipartFile  businessLicenceImage,
    @RequestParam(value = "medias", required = false) List<MultipartFile>  medias
  ) {
    Map<StoreImageType, List<MultipartFile>> images = new EnumMap<>(StoreImageType.class);
    if (avatar != null) images.put(StoreImageType.AVATAR, List.of(avatar));
    if (coverImage != null) images.put(StoreImageType.COVER, List.of(coverImage));
    if (businessLicenceImage != null) images.put(StoreImageType.LICENSE, List.of(businessLicenceImage));
    if (medias != null) images.put(StoreImageType.MEDIAS, medias);

    return ResponseEntity.ok(storeService.updateImage(id, images));
  }

  @GetMapping("/{id}")
  public ResponseEntity<StoreAdminDetailResponse> getFullInfo(@PathVariable("id") String id) {
    return ResponseEntity.ok(storeService.fullInfo(id));
  }

  @GetMapping("/detail/{id}")
  public ResponseEntity<StoreClientDetailResponse> detail(@PathVariable("id") String id) {
    User user = currentUserService.getCurrentUser();
    return ResponseEntity.ok(storeService.detail(id, user));
  }

  @GetMapping("/owner/{owner-id}")
  public ResponseEntity<List<StoreAdminDetailResponse>> getMyStores(@PathVariable("owner-id") String id) {
    User user = currentUserService.getCurrentUser();
    return ResponseEntity.ok(storeService.getStoresByOwnerId(id, user));
  }

  @PostMapping("/update-sport/{id}")
  public ResponseEntity<Void> updateSport(@RequestBody UpdateSportForStoreRequest request,
      @PathVariable("id") String storeId) {
    request.setStoreId(storeId);
    storeHasSportService.updateSportForStore(request);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}/check-suspend")
  public ResponseEntity<CheckSuspendResponse> checkSuspend(
    @PathVariable("id") String id,
    @RequestParam("date")
    @DateTimeFormat(pattern = "yyyy/MM/dd")
    LocalDate date
  ) {
    return ResponseEntity.ok(CheckSuspendResponse.builder()
      .suspended(suspendStoreService.checkSuspend(id, date))
      .build());
  }

  @PostMapping("/{id}/increase-order-count")
  public ResponseEntity<Void> increaseOrderCount(@PathVariable("id") String storeId) {
    storeService.increaseOrderCount(storeId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}/ratings")
  public ResponseEntity<List<RatingResponse>> getStoreRatings(
    @PathVariable String id,
    @RequestParam(required = false) String sportId,
    @RequestParam(required = false) Integer star,
    @RequestParam(required = false, defaultValue = "1") int page,
    @RequestParam(required = false, defaultValue = "12") int perPage) {
    SearchRatingRequest request = SearchRatingRequest.builder()
      .storeId(id)
      .sportId(sportId)
      .star(star)
      .build();
    return ResponseEntity.ok(ratingService.getPageRatingForStore(request, page, perPage));
  }
}