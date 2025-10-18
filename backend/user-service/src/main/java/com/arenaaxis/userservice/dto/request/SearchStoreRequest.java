package com.arenaaxis.userservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchStoreRequest {
  String name;
  String address;
  String wardId;
  String provinceId;
  String sportId;
  SearchPriceRequest price;
}
