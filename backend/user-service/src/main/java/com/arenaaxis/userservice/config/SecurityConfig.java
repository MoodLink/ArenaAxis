package com.arenaaxis.userservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private static final Map<HttpMethod, List<String>> PUBLIC_ENDPOINTS = Map.of(
    HttpMethod.GET, List.of(
      "/sports",
      "/sports/**",
      "/provinces",
      "/provinces/**",
      "/wards",
      "/wards/**",
      "/stores",
      "/stores/detail/**",
      "/banks",
      "/banks/**",
      "/main-plans",
      "/main-plans/**",
      "/ratings",
      "/ratings/**",
      "/users/myself",
      "/users/**",
      "/favourites",
      "/favourites/**"),
    HttpMethod.POST, List.of(
      "/users",
      "/auth",
      "/auth/**",
      "/stores/search",
      "/favourites",
      "recommends/**"),
    HttpMethod.DELETE, List.of(
      "/favourites",
      "/favourites/**"));

  CustomJwtDecoder customJwtDecoder;

  @Autowired
  public SecurityConfig(CustomJwtDecoder customJwtDecoder) {
    this.customJwtDecoder = customJwtDecoder;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(AbstractHttpConfigurer::disable)
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))
      .authorizeHttpRequests(auth -> {
        PUBLIC_ENDPOINTS
          .forEach((method, paths) -> paths.forEach(path -> auth.requestMatchers(method, path).permitAll()));
        auth.anyRequest().authenticated();
      })
      .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
        .decoder(customJwtDecoder)
        .jwtAuthenticationConverter(jwtAuthenticationConverter()))
        .authenticationEntryPoint(new JwtAuthenticationEntry()));

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("*"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
    jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

    JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
    jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

    return jwtAuthenticationConverter;
  }
}
