package com.arenaaxis.messageservice.client.service;

import com.arenaaxis.messageservice.client.dto.response.UserClientResponse;
import reactor.core.publisher.Mono;

public interface UserClientService {
  Mono<UserClientResponse> getUserById(String id);
}
