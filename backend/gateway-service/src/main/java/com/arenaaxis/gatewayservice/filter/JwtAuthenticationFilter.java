package com.arenaaxis.gatewayservice.filter;

import com.arenaaxis.gatewayservice.service.JwtVerifierService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE)
public class JwtAuthenticationFilter implements GlobalFilter {
  private final JwtVerifierService jwtVerifierService;
  private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

  private static final Map<HttpMethod, List<String>> PUBLIC_ENDPOINTS = Map.of(
    HttpMethod.GET, List.of(
      "/sports",
      "/sports/**",
      "/provinces",
      "/provinces/**",
      "/wards",
      "/wards/**",
      "/stores"
    ),
    HttpMethod.POST, List.of(
      "/users",
      "/auth",
      "/auth/**"
    )
  );

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    if (isPublic(exchange)) {
      return chain.filter(exchange);
    }

    var authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
      return exchange.getResponse().setComplete();
    }

    String token = authHeader.substring(7);
    try {
      SignedJWT signedJWT = jwtVerifierService.parseAndVerify(token);
      JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

      String email = claimsSet.getSubject();
      String jti = claimsSet.getJWTID();
      String scope = claimsSet.getStringClaim("scope");

      return chain.filter(
        exchange.mutate()
          .request(r -> r.headers(h -> {
            h.add("X-Jti", jti == null ? "" : jti);
            h.add("X-User-Email", email == null ? "" : email);
            h.add("X-User-Role", extractRoleFromScope(scope));
          }))
          .build());
    } catch (Exception e) {
      exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
      return exchange.getResponse().setComplete();
    }
  }

  private String extractRoleFromScope(String scope) {
    if (scope != null && scope.startsWith("ROLE_")) {
      return scope.substring("ROLE_".length());
    }

    return scope;
  }

  private boolean isPublic(ServerWebExchange exchange) {
    String path = exchange.getRequest().getURI().getPath();
    HttpMethod method = exchange.getRequest().getMethod();
    log.info("Request path: {}, method: {}", path, method);

    List<String> patterns = PUBLIC_ENDPOINTS.get(method);
    if (patterns == null) return false;

    return patterns.stream().anyMatch(pattern -> PATH_MATCHER.match(pattern, path));
  }
}
