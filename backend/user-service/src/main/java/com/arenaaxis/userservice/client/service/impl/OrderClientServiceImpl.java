package com.arenaaxis.userservice.client.service.impl;

import com.arenaaxis.userservice.client.api.OrderApi;
import com.arenaaxis.userservice.client.dto.request.OrdersByStoreRequest;
import com.arenaaxis.userservice.client.dto.response.OrderClientResponse;
import com.arenaaxis.userservice.client.service.OrderClientService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderClientServiceImpl implements OrderClientService {
  OrderApi orderApi;

  @Override
  public List<OrderClientResponse> getByStoreId(OrdersByStoreRequest request) {
    return orderApi.getOrdersByStore(request);
  }
}
