package com.arenaaxis.messageservice.client.service.impl;

import com.arenaaxis.messageservice.client.api.UserApi;
import com.arenaaxis.messageservice.client.dto.response.StoreClientResponse;
import com.arenaaxis.messageservice.client.service.StoreClientService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreClientServiceImpl implements StoreClientService {
  UserApi userApi;

  @Override
  public Mono<StoreClientResponse> getStoreById(String id) {
    return userApi.getStoreById(id);
  }
}
