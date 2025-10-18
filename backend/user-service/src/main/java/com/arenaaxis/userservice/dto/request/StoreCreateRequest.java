package com.arenaaxis.userservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreCreateRequest {
  String name;
  String address;
  String introduction;
  String linkGoogleMap;

  String wardId;

  Float latitude;
  Float longitude;

  LocalTime startTime;
  LocalTime endTime;
}
