package com.arenaaxis.userservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreClientDetailResponse {
  String id;
  String name;
  String introduction;
  String address;
  String linkGoogleMap;

  UserResponse owner;

  Boolean approved;
  Boolean active;

  LocalTime startTime;
  LocalTime endTime;

  Long orderCount;
  Long viewCount;

  String avatarUrl;
  String coverImageUrl;

  List<String> mediaUrls;
  List<SportResponse> sports;
  List<SportRatingResponse> sportRatings;

  Set<StoreUtilityResponse> utilities;

  WardResponse ward;
  ProvinceResponse province;

  BigDecimal latitude;
  BigDecimal longitude;
}
