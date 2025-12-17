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
@Document(collection = "stores")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Store {
  @Id
  String id;
  String name;
  String address;
  String wardId;
  String provinceId;
}
