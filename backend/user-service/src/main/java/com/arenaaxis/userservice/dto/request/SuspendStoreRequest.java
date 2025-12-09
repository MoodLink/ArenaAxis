package com.arenaaxis.userservice.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SuspendStoreRequest {
  String storeId;

  @NotBlank
  @JsonFormat(pattern = "yyyy/MM/dd HH:mm:ss")
  LocalDateTime startAt;

  @JsonFormat(pattern = "yyyy/MM/dd HH:mm:ss")
  LocalDateTime endAt;

  String reason;

  @Builder.Default
  Boolean force = false;
}
