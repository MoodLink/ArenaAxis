package com.arenaaxis.messageservice.config;

import com.arenaaxis.messageservice.websocket.MessageWebsocketHandler;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WebSocketConfig {

  private final MessageWebsocketHandler messageWebsocketHandler;

  @Bean
  public HandlerMapping webSocketMapping() {
    Map<String, WebSocketHandler> map = new HashMap<>();
    map.put("/ws/messages", messageWebsocketHandler);

    return new SimpleUrlHandlerMapping(map, 10);
  }

  @Bean
  public WebSocketHandlerAdapter webSocketHandlerAdapter() {
    return new WebSocketHandlerAdapter();
  }
}
