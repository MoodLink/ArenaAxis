package com.arenaaxis.userservice.exception;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;

import com.arenaaxis.userservice.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalHandleException {
    private static final String MIN_ATTRIBUTE = "min";

  @ExceptionHandler(value = AppException.class)
  ResponseEntity<ErrorResponse> handlingAppException(AppException ex, HttpServletRequest request) {
    ErrorCode errorCode = ex.getErrorCode();
    ErrorResponse body = ErrorResponse.builder()
                                      .status(errorCode.getStatusCode().value())
                                      .code(errorCode.getCode())
                                      .error(errorCode.name())
                                      .message(errorCode.getMessage())
                                      .path(request.getRequestURI())
                                      .timestamp(LocalDateTime.now())
                                      .build();

    return ResponseEntity.status(errorCode.getStatusCode().value()).body(body);
  }

  @ExceptionHandler(value = RuntimeException.class)
  ResponseEntity<ErrorResponse> handlingAppException(RuntimeException exception, HttpServletRequest request) {
    ErrorCode errorCode = ErrorCode.UNKNOWN_ERROR;
    ErrorResponse body = ErrorResponse.builder()
                                      .status(errorCode.getStatusCode().value())
                                      .code(errorCode.getCode())
                                      .error(errorCode.name())
                                      .message(errorCode.getMessage())
                                      .path(request.getRequestURI())
                                      .timestamp(LocalDateTime.now())
                                      .build();

    return ResponseEntity.status(errorCode.getStatusCode().value()).body(body);
  }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ErrorResponse> handlingAccessDeniedException(AccessDeniedException exception) {
      ErrorCode errorCode = ErrorCode.UNAUTHENTICATED;
      return ResponseEntity.status(errorCode.getStatusCode().value())
                           .body(ErrorResponse.builder()
                                              .code(errorCode.getCode())
                                              .message(errorCode.getMessage())
                                              .build());
    }

    @SuppressWarnings("unchecked")
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ErrorResponse> handlingValidation(MethodArgumentNotValidException exception) {
      ErrorCode errorCode = ErrorCode.INVALID_KEY;
      String enumKey = Objects.requireNonNull(exception.getFieldError()).getDefaultMessage();
      Map<String, Object> attributes = null;

      try {
        errorCode = ErrorCode.valueOf(enumKey);
        var constraintViolation = exception.getBindingResult()
                                           .getAllErrors()
                                           .get(0)
                                           .unwrap(ConstraintViolation.class);
        attributes = constraintViolation.getConstraintDescriptor().getAttributes();
      } catch (Exception e) {
        log.error(e.getMessage(), e);
      }

      return ResponseEntity.status(errorCode.getStatusCode())
                           .body(ErrorResponse.builder()
                             .code(errorCode.getCode())
                             .message(
                               Objects.nonNull(attributes)
                                 ? mapAttribute(errorCode.getMessage(), attributes)
                                 : errorCode.getMessage())
                             .build());
    }

    private String mapAttribute(String message, Map<String, Object> attributes) {
        String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));

        return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
    }
}