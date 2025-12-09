package com.arenaaxis.gateway.filter;

import com.arenaaxis.gateway.config.CustomReactiveJwtDecoder;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WebSocketAuthenticationFilter implements GlobalFilter, Ordered {
  CustomReactiveJwtDecoder jwtDecoder;

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    ServerHttpRequest request = exchange.getRequest();
    String path = request.getURI().getPath();
    log.info("path: {}", path);

    if (!isWebSocketRequest(request) || !path.startsWith("/ws")) {
      return chain.filter(exchange);
    }

    String token = request.getQueryParams().getFirst("token");
    if (token == null || token.isEmpty()) {
      String authHeader = request.getHeaders().getFirst("Authorization");
      if (authHeader != null && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (token == null || token.isEmpty()) {
      log.warn("WebSocket connection attempt without token");
      exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
      return exchange.getResponse().setComplete();
    }

    final String finalToken = token;
    return jwtDecoder.decode(token)
      .flatMap(jwt -> {
        log.info("WebSocket authenticated for user: {}", jwt.getSubject());
        JwtAuthenticationToken authentication = new JwtAuthenticationToken(jwt);

        ServerHttpRequest mutatedRequest = request.mutate()
          .header(HttpHeaders.AUTHORIZATION, "Bearer " + finalToken)
          .header("X-User-Email", jwt.getSubject())
          .build();

        return chain.filter(exchange.mutate()
            .request(mutatedRequest)
            .build())
          .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authentication));
      })
      .onErrorResume(e -> {
        log.error("WebSocket authentication failed: {}", e.getMessage());
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
      });
  }

  @Override
  public int getOrder() {
    return -100;
  }

  private boolean isWebSocketRequest(ServerHttpRequest request) {
    HttpHeaders headers = request.getHeaders();
    return headers.getUpgrade() != null &&
      "websocket".equalsIgnoreCase(headers.getUpgrade());
  }
}
