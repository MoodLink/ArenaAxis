package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.request.AuthenticationRequest;
import com.arenaaxis.userservice.dto.request.LogoutRequest;
import com.arenaaxis.userservice.dto.request.RefreshRequest;
import com.arenaaxis.userservice.dto.response.AuthenticationResponse;
import com.arenaaxis.userservice.dto.response.RefreshResponse;
import com.arenaaxis.userservice.entity.enums.Role;
import com.arenaaxis.userservice.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
  AuthenticationService authenticationService;

  @PostMapping("/user")
  public ResponseEntity<AuthenticationResponse> loginUser(@RequestBody AuthenticationRequest request) {
    return ResponseEntity.ok(authenticationService.authenticate(request, Role.USER));
  }

  @PostMapping("/client")
  public ResponseEntity<AuthenticationResponse> loginOwner(@RequestBody AuthenticationRequest request) {
    return ResponseEntity.ok(authenticationService.authenticate(request, Role.CLIENT));
  }

  @PostMapping("/admin")
  public ResponseEntity<AuthenticationResponse> loginAdmin(@RequestBody AuthenticationRequest request) {
    return ResponseEntity.ok(authenticationService.authenticate(request, Role.ADMIN));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
    return ResponseEntity.ok(authenticationService.authenticate(request, null));
  }

  @PostMapping("/refresh")
  public ResponseEntity<RefreshResponse> refresh(@RequestBody RefreshRequest request)
    throws ParseException, JOSEException {
    return ResponseEntity.ok(authenticationService.refresh(request));
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout(@RequestBody LogoutRequest request)
    throws ParseException, JOSEException {
    authenticationService.logout(request);
    return ResponseEntity.noContent().build();
  }
}
