package com.arenaaxis.userservice.dto.request;

import com.arenaaxis.userservice.utility.Constant;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateRequest {
  @Email(message = Constant.INVALID_EMAIL_MSG)
  @NotBlank(message = Constant.INVALID_EMAIL_MSG)
  String email;

  @NotBlank(message = Constant.INVALID_USER_NAME_MSG)
  @Pattern(
    regexp = Constant.STRING_REGEX,
    message = Constant.INVALID_USER_NAME_MSG
  )
  String name;

  @Size(min = 8, message = Constant.INVALID_PASSWORD_MSG)
  @Pattern(
    regexp = Constant.PASSWORD_REGEX,
    message = Constant.INVALID_PASSWORD_MSG
  )
  String password;

  @Size(max = 10, min = 10, message = Constant.INVALID_PASSWORD_MSG)
  @Pattern(
    regexp = Constant.NUMBER_REGEX,
    message = Constant.INVALID_PHONE_MSG
  )
  String phone;
}
