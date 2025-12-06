package com.arenaaxis.userservice.dto.response;

import com.arenaaxis.userservice.entity.enums.UtilityType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreUtilityResponse {
  UtilityType type;
  LocalDate expiredAt;
}
