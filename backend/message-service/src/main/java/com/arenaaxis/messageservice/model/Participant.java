package com.arenaaxis.messageservice.model;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "participants")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Participant {
  @Id
  String id;
  String name;
  String email;
  String avatarUrl;
}
