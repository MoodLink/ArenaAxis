package com.arenaaxis.userservice.controller;

import java.util.List;

import com.arenaaxis.userservice.dto.request.RatingUpdateRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.arenaaxis.userservice.dto.request.RatingRequest;
import com.arenaaxis.userservice.dto.response.RatingResponse;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.service.CurrentUserService;
import com.arenaaxis.userservice.service.RatingService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ratings")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RatingController {
  CurrentUserService currentUserService;
  RatingService ratingService;

  @PostMapping
  public ResponseEntity<RatingResponse> create(
    @RequestPart("ratingRequest") RatingRequest ratingRequest,
    @RequestPart(value = "medias", required = false) List<MultipartFile> medias
  ) {
    User current = currentUserService.getCurrentUser();

    return ResponseEntity.ok(ratingService.create(ratingRequest, medias, current));
  }

  @GetMapping("/{id}")
  public ResponseEntity<RatingResponse> get(@PathVariable("id") String id) {
    return ResponseEntity.ok(ratingService.getById(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<RatingResponse> update(
    @PathVariable("id") String ratingId,
    @RequestPart("ratingRequest") RatingUpdateRequest request,
    @RequestPart(value = "medias", required = false) List<MultipartFile> medias
  ) {
    return null;
  }

  @GetMapping("/stores/{store_id}")
  public ResponseEntity<List<RatingResponse>> getRatings(@PathVariable("store_id") String storeId) {
    return null;
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") String ratingId) {
    User user = currentUserService.getCurrentUser();

    ratingService.delete(ratingId, user);
    return ResponseEntity.noContent().build();
  }
}
