package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.UserCreateRequest;
import com.arenaaxis.userservice.dto.response.UserResponse;

import java.util.List;

public interface UserService {
  UserResponse createUser(UserCreateRequest request);
  UserResponse getUserById(String id);
  UserResponse getUserByEmail(String email);
  List<UserResponse> getUserPagination(int page, int pageSize);
  void deleteUser(String id);
  UserResponse toggleActiveUser(String id);
}
