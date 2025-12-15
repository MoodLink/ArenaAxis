package com.arenaaxis.messageservice.websocket.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplyPostSocketRequest {
  String postId;
  Integer number;
}
