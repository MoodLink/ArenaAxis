package com.arenaaxis.userservice.service.mail.model;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@FieldDefaults(level = AccessLevel.PROTECTED)
@NoArgsConstructor
public class BaseEmailModel {
  String title;
  String brandName;
  String brandLogoUrl;
  String companyAddress;
  String supportEmail;
  String supportEmailUrl;
  String termsUrl;
  String year;
}
