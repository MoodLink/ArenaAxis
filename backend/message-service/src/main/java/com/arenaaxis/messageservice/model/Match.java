package com.arenaaxis.messageservice.model;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "matches")
@FieldDefaults(level = AccessLevel.PRIVATE)
@CompoundIndex(
  name = "order_posted_date_idx",
  def = "{'orderId': 1, 'isPosted': 1, 'date': 1, 'startTime': 1}"
)
public class Match {
  @Id
  @Builder.Default
  String id = UUID.randomUUID().toString();

  String orderId;
  LocalDate date;
  String sportId;

  LocalTime startTime;
  LocalTime endTime;

  Field field;
  String storeId;

  @Builder.Default
  Boolean isPosted = false;

  Long price;

  @Getter
  @Setter
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class Field {
    String id;
    String name;
  }
}
