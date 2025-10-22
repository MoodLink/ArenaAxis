package com.arenaaxis.gatewayservice.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

  @Bean
  public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
    return builder.routes()
      .route("user-service", r -> r
          .path(
            "/users/**",
            "/banks/**",
            "/bank-accounts/**",
            "/provinces/**",
            "/wards/**",
            "/auth/**",
            "/stores/**",
            "/sports/**",
            "/main-plans/**",
            "/subscriptions/**")
          .uri("lb://user-service")
      )
      .build();
  }
}
