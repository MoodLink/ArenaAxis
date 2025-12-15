package com.arenaaxis.messageservice.model;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "posts")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Post {
  @Id
  @Builder.Default
  String id = UUID.randomUUID().toString();

  String title;
  String description;

  String posterId;

  Integer requiredNumber;
  Integer currentNumber;

  List<String> participantIds;
  List<String> matchIds;

  @Builder.Default
  Boolean active = true;

  Long pricePerPerson;
  String sportId;

  @Builder.Default
  LocalDateTime timestamp = LocalDateTime.now();

  List<Comment> comments;
}
