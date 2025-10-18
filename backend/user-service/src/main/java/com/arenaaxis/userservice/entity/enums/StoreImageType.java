package com.arenaaxis.userservice.entity.enums;

import lombok.Getter;

@Getter
public enum StoreImageType {
  AVATAR("avatar"),
  COVER("coverImage"),
  LICENSE("businessLicenseImage"),
  MEDIAS("medias");

  final String attributeName;
  StoreImageType(String attributeName) {
    this.attributeName = attributeName;
  }
}
