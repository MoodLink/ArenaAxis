package com.arenaaxis.userservice.dto.request;

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
public class SearchSuspendStoreRequest {
  String storeId;

  @JsonFormat(pattern = "yyyy/MM/dd HH:mm:ss")
  LocalDateTime from;

  @JsonFormat(pattern = "yyyy/MM/dd HH:mm:ss")
  LocalDateTime to;
}
