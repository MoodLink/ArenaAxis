package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.request.SearchStoreRequest;
import com.arenaaxis.userservice.dto.request.StoreCreateRequest;
import com.arenaaxis.userservice.dto.response.StoreAdminDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.entity.enums.StoreImageType;
import com.arenaaxis.userservice.service.CurrentUserService;
import com.arenaaxis.userservice.service.StoreService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;
import java.util.HashMap;
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

  @GetMapping
  public ResponseEntity<List<StoreSearchItemResponse>> getPageStores(
//    @RequestBody SearchStoreRequest searchRequest,
    @RequestParam(value = "page", defaultValue = "1") int page,
    @RequestParam(value = "perPage", defaultValue = "12") int perPage) {
      return ResponseEntity.ok(storeService.getInPagination(page, perPage));
  }

  @PostMapping
  public ResponseEntity<StoreAdminDetailResponse> addStore(@RequestBody StoreCreateRequest request)
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
    Map<StoreImageType, List<MultipartFile>> images = new HashMap<>();
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

  @GetMapping("/owner/{owner-id}")
  public ResponseEntity<List<StoreAdminDetailResponse>> getMyStores(@PathVariable("owner-id") String id) {
    User user = currentUserService.getCurrentUser();
    return ResponseEntity.ok(storeService.getStoresByOwnerId(id, user));
  }
}
