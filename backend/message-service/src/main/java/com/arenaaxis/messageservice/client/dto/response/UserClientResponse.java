package com.arenaaxis.messageservice.client.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserClientResponse {
  String id;
  String name;
  String email;
  String avatarUrl;
}
