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
public class FieldCreateRequest {
  String name;
  String sportId;

  LocalTime startTime;
  LocalTime endTime;

  Float defaultPrice;
}
