package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.service.CurrentUserService;
import com.arenaaxis.userservice.service.StoreMediaService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/store-medias")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreMediaController {
  CurrentUserService currentUserService;
  StoreMediaService storeMediaService;

  @DeleteMapping("/{id}")
  ResponseEntity<Void> delete(@PathVariable String id) {
    User user = currentUserService.getCurrentUser();
    if (user == null) return ResponseEntity.notFound().build();

    storeMediaService.delete(id, user);
    return ResponseEntity.noContent().build();
  }
}
