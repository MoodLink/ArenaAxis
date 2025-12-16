package com.arenaaxis.messageservice.dto.response;

import com.arenaaxis.messageservice.model.Participant;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplyPostResponse {
  String id;
  String title;
  Participant poster;
  LocalDateTime timestamp;
  StoreResponse store;
  List<String> participantIds;
}
