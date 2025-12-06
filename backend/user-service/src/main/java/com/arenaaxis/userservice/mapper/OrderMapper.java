package com.arenaaxis.userservice.mapper;

import com.arenaaxis.userservice.client.dto.response.OrderClientResponse;
import com.arenaaxis.userservice.dto.response.RemainingOrderResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = OrderDetailMapper.class)
public interface OrderMapper {
  RemainingOrderResponse toRemainingOrderResponse(OrderClientResponse orderClientResponse);
}