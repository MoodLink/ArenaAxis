package com.arenaaxis.messageservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ErrorResponse {
  int status;
  int code;
  String message;
  String error;
  String path;
  LocalDateTime timestamp;
}
