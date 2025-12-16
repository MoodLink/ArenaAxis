package com.arenaaxis.messageservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchPostRequest {
  String posterName;
  String storeName;

  LocalDate fromDate;
  LocalDate toDate;

  String sportId;
}
