package com.arenaaxis.userservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

  @Bean("orderWebClient")
  public WebClient orderWebClient(@Value("${service.order.url}") String orderBaseUrl) {
    return WebClient.builder().baseUrl(orderBaseUrl).build();
  }
}
