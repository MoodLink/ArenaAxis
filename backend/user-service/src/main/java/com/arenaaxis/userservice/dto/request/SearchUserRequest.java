package com.arenaaxis.userservice.dto.request;

import javax.management.relation.Role;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchUserRequest {
  String name;
  String email;
  String phone;
  Role role;
  String bankAccountNumber;
}
