package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.repository.UserRepository;
import com.arenaaxis.userservice.service.CurrentUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CurrentUserServiceImpl implements CurrentUserService {
  UserRepository userRepository;

  @Override
  public User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null ||
        !authentication.isAuthenticated() ||
        authentication instanceof AnonymousAuthenticationToken) {
      return null;
    }

    String email = authentication.getName();
    return userRepository.findByEmail(email)
      .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
  }
}
