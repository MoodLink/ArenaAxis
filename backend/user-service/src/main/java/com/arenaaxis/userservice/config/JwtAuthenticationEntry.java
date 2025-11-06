package com.arenaaxis.userservice.config;

import com.arenaaxis.userservice.dto.response.ErrorResponse;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

public class JwtAuthenticationEntry implements AuthenticationEntryPoint {

  @Override
  public void commence(
    HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
    throws IOException, ServletException {
    ErrorCode errorCode = ErrorCode.UNAUTHENTICATED;
    response.setStatus(errorCode.getStatusCode().value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    ErrorResponse errorResponse = ErrorResponse.builder()
      .code(errorCode.getCode())
      .message(errorCode.getMessage())
      .build();
    ObjectMapper objectMapper = new ObjectMapper();
    response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    response.flushBuffer();
  }
}
