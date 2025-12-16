package com.arenaaxis.messageservice.client.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderClientResponse {
  String _id;
  String userId;
  String storeId;
  String statusPayment;
  Long cost;
  String orderCode;

  List<OrderDetailClientResponse> orderDetails;
}
