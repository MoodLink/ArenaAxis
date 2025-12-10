package com.arenaaxis.messageservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

  @Bean("userWebClient")
  public WebClient userWebClient(@Value("${service.user.url}") String url) {
    return WebClient.builder().baseUrl(url).build();
  }
}
