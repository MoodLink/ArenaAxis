package com.arenaaxis.userservice.client.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrdersByStoreRequest {
  String storeId;
  LocalDateTime startTime;
  LocalDateTime endTime;
}
