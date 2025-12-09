package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.request.UserCreateRequest;
import com.arenaaxis.userservice.dto.response.UserResponse;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.entity.enums.Role;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.mapper.UserMapper;
import com.arenaaxis.userservice.repository.UserRepository;
import com.arenaaxis.userservice.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
  UserRepository userRepository;
  PasswordEncoder passwordEncoder;
  UserMapper userMapper;

  @Override
  public UserResponse createUser(UserCreateRequest request) {
    if (userRepository.existsByEmail(request.getEmail()))
      throw new AppException(ErrorCode.USER_EXISTED);

    User user = userMapper.toUser(request);
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    user.setRole(Role.USER);
    user = userRepository.save(user);

    return userMapper.toUserResponse(user);
  }

  @Override
  public UserResponse getUserById(String id) {
    User user = userRepository
      .findById(id)
      .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    return userMapper.toUserResponse(user);
  }

  @Override
  public UserResponse getUserByEmail(String email) {
    return userMapper.toUserResponse(userRepository.findByEmail(email)
      .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
  }

  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public List<UserResponse> getUserPagination(int page, int pageSize) {
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by("createdAt").descending());
    Page<User> users = userRepository.findAll(pageable);

    return users.getContent()
      .stream()
      .map(userMapper::toUserResponse)
      .toList();
  }

  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public void deleteUser(String id) {
    userRepository.deleteById(id);
  }

  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public UserResponse toggleActiveUser(String id) {
    User user = userRepository
      .findById(id)
      .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    user.setActive(!user.isActive());
    return userMapper.toUserResponse(user);
  }
}
