package com.arenaaxis.messageservice.client.api;

import com.arenaaxis.messageservice.client.dto.response.OrderApiResponse;
import com.arenaaxis.messageservice.client.dto.response.OrderClientResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderApi {
  WebClient orderWebClient;

  public Mono<OrderClientResponse> getOrderById(String orderId) {
    return orderWebClient.get()
      .uri(uriBuilder -> uriBuilder.path("/orders/{id}").build(orderId))
      .retrieve()
      .bodyToMono(new ParameterizedTypeReference<OrderApiResponse<OrderClientResponse>>() {
      })
      .map(OrderApiResponse::getData)
      .doOnError(error ->
        log.error("Failed to fetch order {} from order-service: {}", orderId, error.getMessage())
      )
      .onErrorResume(error -> Mono.empty());
  }
}
