package com.arenaaxis.userservice.dto.request;

import com.arenaaxis.userservice.entity.enums.UtilityType;
import com.arenaaxis.userservice.utility.Constant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreCreateRequest {
  @NotBlank(message = Constant.NOT_BLANK_STORE_NAME)
  @Pattern(
    regexp = Constant.NAME_STORE_REGEX,
    message = Constant.INVALID_STORE_NAME
  )
  String name;

  @NotBlank(message = Constant.NOT_BLANK_STORE_ADDRESS)
  String address;

  String introduction;

  @Pattern(
    regexp = Constant.LINK_GOOGLE_MAP_REGEX,
    message = Constant.INVALID_LINK_GOOGLE_MAP
  )
  String linkGoogleMap;

  @NotBlank(message = Constant.NOT_BLANK_WARD_ID)
  String wardId;
  LocalTime startTime;
  LocalTime endTime;

  List<UtilityType> utilities;
}
