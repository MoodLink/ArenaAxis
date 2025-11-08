package com.arenaaxis.userservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RatingResponse {
  String id;
  Float star;
  SportResponse sport;
  StoreSearchItemResponse store;
  UserResponse user;
  List<String> mediaUrls;
}
