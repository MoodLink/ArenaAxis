package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.AuthenticationRequest;
import com.arenaaxis.userservice.dto.request.IntrospectRequest;
import com.arenaaxis.userservice.dto.request.LogoutRequest;
import com.arenaaxis.userservice.dto.request.RefreshRequest;
import com.arenaaxis.userservice.dto.response.AuthenticationResponse;
import com.arenaaxis.userservice.dto.response.IntrospectResponse;
import com.arenaaxis.userservice.dto.response.RefreshResponse;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.entity.enums.Role;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationService {
  IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
  AuthenticationResponse authenticate(AuthenticationRequest request, Role role);
  RefreshResponse refresh(RefreshRequest request) throws ParseException, JOSEException;
  void logout(LogoutRequest request) throws ParseException, JOSEException;
  String buildTokenWhenUpgradeUser(User user) throws ParseException, JOSEException;
}
