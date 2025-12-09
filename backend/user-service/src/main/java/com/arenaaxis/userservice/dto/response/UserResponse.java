package com.arenaaxis.userservice.dto.response;

import com.arenaaxis.userservice.entity.enums.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
  String id;
  String email;
  String name;
  String phone;
  String avatarUrl;
  boolean active;

  Role role;
  BankAccountResponse bankAccount;
}
