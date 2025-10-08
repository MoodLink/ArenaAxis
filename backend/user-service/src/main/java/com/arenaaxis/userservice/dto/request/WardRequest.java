package com.arenaaxis.userservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WardRequest {
  String id;
  String name;
  String nameEn;
  String provinceId;
  Float latitude;
  Float longitude;
}
