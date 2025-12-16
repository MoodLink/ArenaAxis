package com.arenaaxis.messageservice.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
  USER_NOT_FOUND(1001, "User not found", HttpStatus.BAD_REQUEST),
  ORDER_NOT_FOUND(1002, "Order not found", HttpStatus.BAD_REQUEST),
  INVALID_MATCH_SLOT(1003, "Match is not valid", HttpStatus.BAD_REQUEST),
  MATCH_NOT_FOUND(1004, "Match is not valid", HttpStatus.BAD_REQUEST),
  MESSAGE_NOT_FOUND(1005, "Message not found", HttpStatus.BAD_REQUEST),
  FORBIDDEN(1006, "Forbidden", HttpStatus.FORBIDDEN),
  ;

  private final int code;
  private final String message;
  private final HttpStatusCode httpStatusCode;

  ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
    this.code = code;
    this.message = message;
    this.httpStatusCode = httpStatusCode;
  }
}
