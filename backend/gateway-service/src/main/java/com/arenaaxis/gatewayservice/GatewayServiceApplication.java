package com.arenaaxis.gatewayservice;

import org.springdoc.core.properties.AbstractSwaggerUiConfigProperties;
import org.springdoc.core.properties.SwaggerUiConfigProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Lazy;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import static org.springdoc.core.utils.Constants.DEFAULT_API_DOCS_URL;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(GatewayServiceApplication.class, args);
  }

  @Bean
  @Lazy(value = false)
  public Set<AbstractSwaggerUiConfigProperties.SwaggerUrl> apis(
    RouteDefinitionLocator locator,
    SwaggerUiConfigProperties properties) {
    Set<AbstractSwaggerUiConfigProperties.SwaggerUrl> urls = new HashSet<>();
    List<RouteDefinition> definitions = locator.getRouteDefinitions().collectList().block();
    Objects.requireNonNull(definitions).stream().filter(routeDefinition -> routeDefinition.getId()
      .matches(".*-service")).forEach(routeDefinition -> {
      String name = routeDefinition.getId().split("-service")[0];
      AbstractSwaggerUiConfigProperties.SwaggerUrl url = new AbstractSwaggerUiConfigProperties
        .SwaggerUrl(name, DEFAULT_API_DOCS_URL+"/" + name, null);
      urls.add(url);
    });
    return urls;
  }
}
