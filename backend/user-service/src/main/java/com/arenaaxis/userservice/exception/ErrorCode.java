package com.arenaaxis.userservice.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
  UNKNOWN_ERROR(9999, "Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR),
  UNAUTHENTICATED(1001, "Unauthenticated", HttpStatus.UNAUTHORIZED),
  USER_EXISTED(1002, "User already exists", HttpStatus.BAD_REQUEST),
  USER_NOT_FOUND(1003, "User Not Found", HttpStatus.BAD_REQUEST),
  BANK_NOT_FOUND(1004, "Bank not exists", HttpStatus.BAD_REQUEST),
  BANK_ACCOUNT_NOT_FOUND(1005, "Bank Account Not Found", HttpStatus.BAD_REQUEST),
  WARD_NOT_FOUND(1006, "Ward not exists", HttpStatus.BAD_REQUEST),
  PROVINCE_NOT_FOUND(1007, "Province not exists", HttpStatus.BAD_REQUEST),
  STORE_NOT_FOUND(1008, "Store not exists", HttpStatus.BAD_REQUEST),
  SPORT_NOT_FOUND(10039, "Sport not found", HttpStatus.BAD_REQUEST),
  EXTRACT_PUBLIC_ID(4003, "Have errors when extracting public id", HttpStatus.INTERNAL_SERVER_ERROR),
  INVALID_KEY(4004, "Invalid Key", HttpStatus.BAD_REQUEST),
  INVALID_EMAIL(4005, "Invalid Email", HttpStatus.BAD_REQUEST),
  INVALID_NAME(4006, "Name can not contain number or special character", HttpStatus.BAD_REQUEST),
  INVALID_PASSWORD(4007, "Password contains at least character, number", HttpStatus.BAD_REQUEST),
  INVALID_PHONE(4008, "Phone number can only contain number and has 10 characters", HttpStatus.BAD_REQUEST),
  INVALID_BANK_ACCOUNT_NUMBER(4009, "Invalid Bank Account Number", HttpStatus.BAD_REQUEST),
  INVALID_BANK_ACCOUNT_NAME(4010, "Invalid Bank Account Name", HttpStatus.BAD_REQUEST),
  ;

  private final int code;
  private final String message;
  private final HttpStatusCode statusCode;

  ErrorCode(int code, String message, HttpStatusCode statusCode) {
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
  }
}
