package com.arenaaxis.messageservice.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
  USER_NOT_FOUND(1001, "User not found");

  private final int code;
  private final String message;

  ErrorCode(int code, String message) {
    this.code = code;
    this.message = message;
  }
}
