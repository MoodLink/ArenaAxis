package com.arenaaxis.userservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreAdminDetailResponse {
  String id;
  String name;
  String introduction;
  String address;
  String linkGoogleMap;

  UserResponse owner;

  Boolean active;
  Boolean approved;
  Boolean approvable;

  LocalTime startTime;
  LocalTime endTime;

  LocalDateTime createdAt;
  LocalDateTime updatedAt;
  LocalDateTime deletedAt;

  Long orderCount;
  Long viewCount;

  String avatarUrl;
  String coverImageUrl;
  String businessLicenceImageUrl;

  String newToken;

  Set<StoreUtilityResponse> utilities;

  BigDecimal latitude;
  BigDecimal longitude;

  WardResponse ward;
  ProvinceResponse province;

  List<String> mediaUrls;
}
