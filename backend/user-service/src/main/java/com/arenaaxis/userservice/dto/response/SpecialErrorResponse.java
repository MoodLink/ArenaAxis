package com.arenaaxis.userservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SpecialErrorResponse<T> {
  int status;
  int code;
  String message;
  String error;
  String path;
  LocalDateTime timestamp;
  T data;
}
