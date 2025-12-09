package com.arenaaxis.messageservice.client.api;

import com.arenaaxis.messageservice.client.dto.response.UserClientResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Component
@Slf4j
public class UserApi {
  @Qualifier(value = "userWebClient")
  private final WebClient userWebClient;

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
}
