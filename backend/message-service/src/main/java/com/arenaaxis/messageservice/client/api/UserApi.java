package com.arenaaxis.messageservice.client.api;

import com.arenaaxis.messageservice.client.dto.response.StoreClientResponse;
import com.arenaaxis.messageservice.client.dto.response.UserClientResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserApi {
  WebClient userWebClient;

  public Mono<UserClientResponse> getUserById(String id) {
    return userWebClient.get()
      .uri(uriBuilder -> uriBuilder.path("/users/{id}").build(id))
      .retrieve()
      .bodyToMono(UserClientResponse.class)
      .doOnError(error ->
        log.error("Failed to fetch user {} from user-service: {}", id, error.getMessage())
      )
      .onErrorResume(error -> Mono.empty());
  }

  public Mono<StoreClientResponse> getStoreById(String storeId) {
    return userWebClient.get()
      .uri(builder -> builder.path("/stores/detail/{id}").build(storeId))
      .retrieve()
      .bodyToMono(StoreClientResponse.class)
      .doOnError(error ->
        log.error("Failed to fetch store {} from user-service: {}", storeId, error.getMessage())
      )
      .onErrorResume(error -> Mono.empty());
  }
}
