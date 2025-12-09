package com.arenaaxis.userservice.mapper;

import com.arenaaxis.userservice.client.dto.response.OrderDetailClientResponse;
import com.arenaaxis.userservice.dto.response.RemainingOrderDetailResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {
  RemainingOrderDetailResponse toRemainingResponse(OrderDetailClientResponse orderDetailClientResponse);
}
