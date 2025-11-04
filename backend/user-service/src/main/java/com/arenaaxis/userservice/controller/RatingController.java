package com.arenaaxis.userservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
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

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") String ratingId) {
    User user = currentUserService.getCurrentUser();

    ratingService.delete(ratingId, user);
    return ResponseEntity.noContent().build();
  }
}
