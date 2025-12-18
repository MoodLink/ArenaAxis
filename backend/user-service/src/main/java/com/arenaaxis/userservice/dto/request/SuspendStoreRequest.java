package com.arenaaxis.userservice.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SuspendStoreRequest {
  String storeId;

  @NotBlank
  @JsonFormat(pattern = "yyyy/MM/dd")
  LocalDate startAt;

  @JsonFormat(pattern = "yyyy/MM/dd")
  LocalDate endAt;

  String reason;

  @Builder.Default
  Boolean force = false;
}
