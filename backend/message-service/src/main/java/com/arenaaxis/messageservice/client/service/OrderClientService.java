package com.arenaaxis.messageservice.client.service;

import com.arenaaxis.messageservice.client.dto.response.OrderClientResponse;
import reactor.core.publisher.Mono;

public interface OrderClientService {
  Mono<OrderClientResponse> getOrderById(String orderId);
}
