package com.arenaaxis.messageservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostCreateRequest {
  String userId;
  String title;
  String description;

  List<String> matchIds;

  Integer requiredNumber;
  Integer currentNumber;
}
