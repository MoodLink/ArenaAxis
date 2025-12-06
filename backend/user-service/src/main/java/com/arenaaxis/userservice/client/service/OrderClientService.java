package com.arenaaxis.userservice.client.service;

import com.arenaaxis.userservice.client.dto.request.OrdersByStoreRequest;
import com.arenaaxis.userservice.client.dto.response.OrderClientResponse;

import java.util.List;

public interface OrderClientService {
  List<OrderClientResponse> getByStoreId(OrdersByStoreRequest request);
}
