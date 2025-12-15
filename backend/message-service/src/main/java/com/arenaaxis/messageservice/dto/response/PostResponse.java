package com.arenaaxis.messageservice.dto.response;

import com.arenaaxis.messageservice.model.Comment;
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
public class PostResponse {
  String id;

  String title;
  String description;

  Participant poster;

  Integer requiredNumber;
  Integer currentNumber;

  List<Participant> participants;
  List<MatchResponse> matches;

  Long pricePerPerson;

  LocalDateTime timestamp;

  List<Comment> comments;

  StoreResponse store;

  SportResponse sport;
}
