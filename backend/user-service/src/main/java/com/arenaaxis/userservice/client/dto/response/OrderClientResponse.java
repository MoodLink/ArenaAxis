package com.arenaaxis.userservice.client.dto.response;

import com.arenaaxis.userservice.client.dto.enums.StatusPayment;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderClientResponse {
  String _id;
  String userId;
  String storeId;
  Long cost;
  Boolean isRated;
  LocalDateTime createdAt;
  LocalDateTime updatedAt;
  String orderCode;
  StatusPayment statusPayment;
  List<OrderDetailClientResponse> orderDetails;
}
