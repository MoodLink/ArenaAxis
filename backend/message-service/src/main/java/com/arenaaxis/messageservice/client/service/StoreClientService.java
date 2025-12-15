package com.arenaaxis.messageservice.client.service;

import com.arenaaxis.messageservice.client.dto.response.StoreClientResponse;
import reactor.core.publisher.Mono;

public interface StoreClientService {
  Mono<StoreClientResponse> getStoreById(String id);
}
