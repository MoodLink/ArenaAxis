package com.arenaaxis.messageservice.client.service.impl;

import com.arenaaxis.messageservice.client.api.OrderApi;
import com.arenaaxis.messageservice.client.dto.response.OrderClientResponse;
import com.arenaaxis.messageservice.client.service.OrderClientService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderClientServiceImpl implements OrderClientService {
  OrderApi orderApi;

  @Override
  public Mono<OrderClientResponse> getOrderById(String orderId) {
    return orderApi.getOrderById(orderId);
  }
}
