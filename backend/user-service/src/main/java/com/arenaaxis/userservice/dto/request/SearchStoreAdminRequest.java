package com.arenaaxis.userservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchStoreAdminRequest {
  String name;
  String wardId;
  String provinceId;
  String sportId;
  Boolean approved;
  Boolean approvable;
}
