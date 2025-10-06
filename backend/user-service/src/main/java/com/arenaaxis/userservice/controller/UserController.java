package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.request.UserCreateRequest;
import com.arenaaxis.userservice.dto.response.UserResponse;
import com.arenaaxis.userservice.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
  UserService userService;

  @PostMapping
  public ResponseEntity<UserResponse> create(@RequestBody @Validated UserCreateRequest request) {
    return ResponseEntity.ok(userService.createUser(request));
  }

  @GetMapping("/{id}")
  public ResponseEntity<UserResponse> show(@PathVariable String id) {
    return ResponseEntity.ok(userService.getUserById(id));
  }

  @GetMapping
  public ResponseEntity<List<UserResponse>> showAll(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "30") int pageSize
  ) {
    return ResponseEntity.ok(userService.getUserPagination(page, pageSize));
  }

  @PutMapping("/{id}/toggle_active")
  public ResponseEntity<UserResponse> toggleActive(@PathVariable String id) {
    return ResponseEntity.ok(userService.toggleActiveUser(id));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {
    userService.deleteUser(id);
    return ResponseEntity.ok().build();
  }
}
