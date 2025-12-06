package com.arenaaxis.userservice.service.mail.model;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
public class StoreApprovedEmailModel extends BaseEmailModel {
  String ownerName;
  String storeName;
  String storeId;
  String approvedAt;
  String ctaUrl;
}