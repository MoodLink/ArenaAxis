package com.arenaaxis.gateway.config;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import javax.crypto.spec.SecretKeySpec;
import java.util.Map;

@Slf4j
@Component
public class CustomReactiveJwtDecoder implements ReactiveJwtDecoder {
  @Value("${jwt.signer-key}")
  private String signerKey;

  @Value("${user-service.url}")
  private String userServiceUrl;

  @Value("${user-service.introspect-endpoint}")
  private String introspectEndpoint;

  private NimbusReactiveJwtDecoder nimbusJwtDecoder;
  private final WebClient webClient;

  public CustomReactiveJwtDecoder(WebClient.Builder webClientBuilder) {
    this.webClient = webClientBuilder.build();
  }

  @Override
  public Mono<Jwt> decode(String token) throws JwtException {
    return introspectToken(token)
      .flatMap(valid -> {
        if (Boolean.FALSE.equals(valid)) {
          return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token"));
        }

        if (nimbusJwtDecoder == null) {
          SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");
          nimbusJwtDecoder = NimbusReactiveJwtDecoder
            .withSecretKey(secretKeySpec)
            .macAlgorithm(MacAlgorithm.HS512)
            .build();
        }

        return nimbusJwtDecoder.decode(token);
      })
      .doOnError(error -> log.error("JWT decode error: {}", error.getMessage()));
  }

  private Mono<Boolean> introspectToken(String token) {
    return webClient.post()
      .uri(userServiceUrl + introspectEndpoint)
      .bodyValue(Map.of("token", token))
      .retrieve()
      .bodyToMono(IntrospectResponse.class)
      .map(IntrospectResponse::isValid)
      .onErrorReturn(false)
      .doOnNext(valid -> log.debug("Token introspection result: {}", valid));
  }

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  private static class IntrospectResponse {
    boolean valid;
  }
}
