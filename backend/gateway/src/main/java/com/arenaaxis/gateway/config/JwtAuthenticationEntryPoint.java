package com.arenaaxis.gateway.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Slf4j
@Component
public class JwtAuthenticationEntryPoint implements ServerAuthenticationEntryPoint {

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public Mono<Void> commence(ServerWebExchange exchange, AuthenticationException ex) {
    log.error("Authentication error: {}", ex.getMessage());

    ErrorResponse errorResponse = ErrorResponse.builder()
      .code(1006)
      .message("Unauthenticated")
      .build();

    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
    exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

    try {
      String json = objectMapper.writeValueAsString(errorResponse);
      byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
      var buffer = exchange.getResponse().bufferFactory().wrap(bytes);

      return exchange.getResponse().writeWith(Mono.just(buffer));
    } catch (Exception e) {
      log.error("Error writing authentication error response", e);
      return exchange.getResponse().setComplete();
    }
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ErrorResponse {
    private int code;
    private String message;
  }
}
