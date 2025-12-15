package com.arenaaxis.messageservice.exception;

import com.arenaaxis.messageservice.dto.response.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(AppException.class)
  public Mono<ResponseEntity<ErrorResponse>> handleAppException(
    AppException ex,
    ServerWebExchange exchange
  ) {
    ErrorCode errorCode = ex.getErrorCode();

    ErrorResponse body = ErrorResponse.builder()
      .status(errorCode.getHttpStatusCode().value())
      .code(errorCode.getCode())
      .error(errorCode.name())
      .message(errorCode.getMessage())
      .path(exchange.getRequest().getPath().value())
      .timestamp(LocalDateTime.now())
      .build();

    log.error("AppException: {}", ex.getMessage());

    return Mono.just(
      ResponseEntity
        .status(errorCode.getHttpStatusCode())
        .body(body)
    );
  }
}
