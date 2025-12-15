package com.arenaaxis.messageservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MatchResponse {
  String id;
  LocalDate date;
  LocalTime startTime;
  LocalTime endTime;
  PostFieldResponse field;
  SportResponse sport;
  Long price;
}
