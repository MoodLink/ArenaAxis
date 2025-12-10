package com.arenaaxis.messageservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ParticipantResponse {
  String id;
  String name;
  String email;
  String avatarUrl;
}
