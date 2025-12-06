package com.arenaaxis.userservice.dto.request;

import com.arenaaxis.userservice.utility.Constant;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationRequest {
  @Email(message = Constant.INVALID_EMAIL_MSG)
  @NotBlank(message = Constant.NOT_BLANK_EMAIL)
  String email;

  @NotBlank(message = Constant.NOT_BLANK_PASSWORD)
  String password;
}
