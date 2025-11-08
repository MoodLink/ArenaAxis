package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.request.AuthenticationRequest;
import com.arenaaxis.userservice.dto.request.IntrospectRequest;
import com.arenaaxis.userservice.dto.request.LogoutRequest;
import com.arenaaxis.userservice.dto.request.RefreshRequest;
import com.arenaaxis.userservice.dto.response.AuthenticationResponse;
import com.arenaaxis.userservice.dto.response.IntrospectResponse;
import com.arenaaxis.userservice.dto.response.RefreshResponse;
import com.arenaaxis.userservice.entity.InvalidatedToken;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.entity.enums.Role;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.mapper.UserMapper;
import com.arenaaxis.userservice.repository.InvalidatedTokenRepository;
import com.arenaaxis.userservice.repository.UserRepository;
import com.arenaaxis.userservice.service.AuthenticationService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {
  InvalidatedTokenRepository invalidatedTokenRepository;
  UserRepository userRepository;
  PasswordEncoder passwordEncoder;
  UserMapper userMapper;

  @NonFinal
  @Value("${jwt.signer_key}")
  protected String SIGNER_KEY;

  @NonFinal
  @Value("${jwt.token_valid_duration}")
  protected long VALID_DURATION;

  @NonFinal
  @Value("${jwt.token_refreshable_duration}")
  protected long REFRESHABLE_DURATION;

  @Override
  public IntrospectResponse introspect(IntrospectRequest request)
    throws ParseException, JOSEException {
    var token = request.getToken();
    boolean isValid = true;
    try {
      verify(token, false);
    } catch (AppException e) {
      isValid = false;
    }
    return IntrospectResponse.builder().valid(isValid).build();
  }

  @Override
  public AuthenticationResponse authenticate(AuthenticationRequest request, Role role) {
    User user = userRepository.findByEmail(request.getEmail())
      .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    if (
      !passwordEncoder.matches(request.getPassword(), user.getPassword()) ||
        (role != null && user.getRole() != role)
    ) {
      throw new AppException(ErrorCode.USER_NOT_FOUND);
    }

    String token = generateToken(user);
    return AuthenticationResponse.builder()
      .token(token)
      .user(userMapper.toUserResponse(user))
      .build();
  }

  @Override
  public RefreshResponse refresh(RefreshRequest request) throws ParseException, JOSEException {
    var signedJwt = verify(request.getToken(), true);
    var jti = signedJwt.getJWTClaimsSet().getJWTID();
    var expiryTime = signedJwt.getJWTClaimsSet().getExpirationTime();
    saveInvalidatedToken(jti, expiryTime);

    String email = signedJwt.getJWTClaimsSet().getSubject();
    User user = userRepository.findByEmail(email)
      .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    String token = generateToken(user);
    return RefreshResponse.builder().token(token).build();
  }

  @Override
  public void logout(LogoutRequest request) throws ParseException, JOSEException {
    try {
      var signedJwt = verify(request.getToken(), false);
      String jit = signedJwt.getJWTClaimsSet().getJWTID();
      Date expiryTime = signedJwt.getJWTClaimsSet().getExpirationTime();
      InvalidatedToken invalidatedToken =
        InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();
      String email = signedJwt.getJWTClaimsSet().getSubject();
      if (!userRepository.existsByEmail(email))
        throw new AppException(ErrorCode.USER_NOT_FOUND);
      invalidatedTokenRepository.save(invalidatedToken);
    } catch (AppException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public String buildTokenWhenUpgradeUser(User user) throws ParseException, JOSEException {
    if (user.getRole() != Role.USER) return null;

    User managedUser = userRepository.findById(user.getId())
      .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    var authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication.getCredentials() instanceof Jwt jwt) {
      var claimsSet = verify(jwt.getTokenValue(), false).getJWTClaimsSet();
      saveInvalidatedToken(claimsSet.getJWTID(), claimsSet.getExpirationTime());
    }

    managedUser.setRole(Role.CLIENT);
    managedUser = userRepository.save(managedUser);
    return generateToken(managedUser);
  }

  private SignedJWT verify (String token, boolean isRefresh)
    throws JOSEException, ParseException {
    JWSVerifier verifier = new MACVerifier(SIGNER_KEY);
    SignedJWT signedJWT = SignedJWT.parse(token);
    Date expiryTime = (isRefresh)
      ? new Date(signedJWT.getJWTClaimsSet()
      .getIssueTime()
      .toInstant()
      .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS)
      .toEpochMilli())
      : signedJWT.getJWTClaimsSet().getExpirationTime();

    var verified = signedJWT.verify(verifier);
    if (!(verified && expiryTime.after(new Date())))
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    return signedJWT;
  }

  private String generateToken(User user) {
    JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
    JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
      .subject(user.getEmail())
      .issuer("Chess PBL4")
      .issueTime(new Date())
      .expirationTime(new Date(
        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
      .jwtID(UUID.randomUUID().toString())
      .claim("scope", "ROLE_" + user.getRole().name())
      .build();
    Payload payload = new Payload(claimsSet.toJSONObject());
    JWSObject jwsObject = new JWSObject(header, payload);
    try {
      jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
      return jwsObject.serialize();
    } catch (JOSEException e) {
      throw new RuntimeException(e);
    }
  }

  private void saveInvalidatedToken(String jti, Date expiryTime) {
    InvalidatedToken invalidatedToken = InvalidatedToken.builder()
      .id(jti)
      .expiryTime(expiryTime)
      .build();
    invalidatedTokenRepository.save(invalidatedToken);
  }
}
