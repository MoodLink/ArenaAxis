package com.arenaaxis.messageservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateParticipantRequest {
  String id;
  String name;
  String email;
  String avatarUrl;
}
