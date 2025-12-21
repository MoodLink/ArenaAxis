package com.arenaaxis.messageservice.dto.response;

import com.arenaaxis.messageservice.model.Participant;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplyResponse {
  Participant applier;
  ApplyPostResponse post;
  Integer number;
  LocalDateTime timestamp;
}
