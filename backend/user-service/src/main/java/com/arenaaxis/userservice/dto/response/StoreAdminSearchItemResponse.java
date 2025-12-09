package com.arenaaxis.userservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreAdminSearchItemResponse {
  String id;
  String name;
  String address;
  String avatarUrl;
  String coverUrl;

  LocalTime startTime;
  LocalTime endTime;

  Float averageRating;

  Long orderCount;
  Long viewCount;

  Boolean approvable;
  Boolean approved;

  WardResponse ward;
  ProvinceResponse province;
}
