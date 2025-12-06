package com.arenaaxis.gateway.config;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtGrantedAuthoritiesConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SecurityConfig {
  CustomReactiveJwtDecoder jwtDecoder;
  JwtAuthenticationEntryPoint entryPoint;

  static String[] PUBLIC_GET_ENDPOINTS = {
    "/sports/**",
    "/provinces/**",
    "/wards/**",
    "/stores/**",
    "/banks/**",
    "/main-plans/**",
    "/ratings/**",
    "/users/myself",
    "/users/**",
    "/favourites/**",
    "/revenues/**"
  };

  static String[] PUBLIC_POST_ENDPOINTS = {
    "/users",
    "/auth/**",
    "/stores/search",
    "/favourites",
    "/recommends/**"
  };

  static String[] PUBLIC_DELETE_ENDPOINTS = {
    "/favourites/**"
  };

  @Bean
  public SecurityWebFilterChain filterChain(ServerHttpSecurity http) {
    http
      .csrf(ServerHttpSecurity.CsrfSpec::disable)
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))
      .authorizeExchange(auth -> auth
        .pathMatchers(HttpMethod.GET, PUBLIC_GET_ENDPOINTS).permitAll()
        .pathMatchers(HttpMethod.POST, PUBLIC_POST_ENDPOINTS).permitAll()
        .pathMatchers(HttpMethod.DELETE, PUBLIC_DELETE_ENDPOINTS).permitAll()
        .pathMatchers("/ws/**").authenticated()
        .anyExchange().authenticated()
      )
      .oauth2ResourceServer(oauth2 -> oauth2
        .jwt(jwt -> jwt
          .jwtDecoder(jwtDecoder)
          .jwtAuthenticationConverter(jwtAuthenticationConverter())
        )
        .authenticationEntryPoint(entryPoint)
      );

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(List.of("*"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public ReactiveJwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter =
      new JwtGrantedAuthoritiesConverter();
    jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

    ReactiveJwtAuthenticationConverter converter =
      new ReactiveJwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(
      new ReactiveJwtGrantedAuthoritiesConverterAdapter(jwtGrantedAuthoritiesConverter)
    );

    return converter;
  }
}
