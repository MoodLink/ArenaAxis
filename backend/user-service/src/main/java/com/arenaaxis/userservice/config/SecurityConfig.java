package com.arenaaxis.userservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final HeaderAuthenticationFilter headerAuthenticationFilter;

  private static final Map<HttpMethod, List<String>> PUBLIC_ENDPOINTS = Map.of(
    HttpMethod.GET, List.of(
      "/sports",
      "/sports/**",
      "/provinces",
      "/provinces/**",
      "/wards",
      "/wards/**",
      "/stores",
      "/main-plans",
      "/main-plans/**"
    ),
    HttpMethod.POST, List.of(
      "/users",
      "/auth",
      "/auth/**"
    )
  );

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(AbstractHttpConfigurer::disable)
      .authorizeHttpRequests(auth -> {
        PUBLIC_ENDPOINTS.forEach((method, endpoints) ->
          auth.requestMatchers(method, endpoints.toArray(String[]::new)).permitAll()
        );
        auth.anyRequest().authenticated();
      })
      .addFilterBefore(headerAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
