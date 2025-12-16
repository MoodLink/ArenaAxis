package com.arenaaxis.messageservice.model;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "apply_posts")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplyPost {
  @Id
  @Builder.Default
  String id = UUID.randomUUID().toString();

  String postId;
  String participantId;
  Integer number;

  @Builder.Default
  LocalDateTime appliedAt = LocalDateTime.now();
}
