package com.arenaaxis.messageservice.client.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetailClientResponse {
  String fieldId;
  String fieldName;

  @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
  LocalDateTime startTime;

  @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
  LocalDateTime endTime;

  Long price;

  @Builder.Default
  String sportId = "football";
}
