package com.arenaaxis.messageservice.client.service.impl;

import com.arenaaxis.messageservice.client.api.UserApi;
import com.arenaaxis.messageservice.client.dto.response.UserClientResponse;
import com.arenaaxis.messageservice.client.service.UserClientService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserClientServiceImpl implements UserClientService {
  UserApi userApi;

  @Override
  public Mono<UserClientResponse> getUserById(String id) {
    return userApi.getUserById(id);
  }
}
