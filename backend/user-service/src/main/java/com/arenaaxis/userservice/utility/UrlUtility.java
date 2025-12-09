package com.arenaaxis.userservice.utility;

import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;

public class UrlUtility {
  private UrlUtility() {}

  public static String extractPublicId(String url) {
    try {
      String[] parts = url.split("/");
      String fileName = parts[parts.length - 1];
      return fileName.substring(0, fileName.lastIndexOf("."));
    } catch (Exception e) {
      throw new AppException(ErrorCode.EXTRACT_PUBLIC_ID);
    }
  }
}
