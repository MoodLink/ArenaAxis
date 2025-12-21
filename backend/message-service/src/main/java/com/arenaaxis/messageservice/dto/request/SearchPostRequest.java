package com.arenaaxis.messageservice.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
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
  String storeName;

  @JsonFormat(pattern = "yyyy-MM-dd")
  LocalDate fromDate;

  @JsonFormat(pattern = "yyyy-MM-dd")
  LocalDate toDate;

  String sportId;
  String wardId;
  String provinceId;
}
