package com.arenaaxis.messageservice.websocket.handler;

import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;

import java.util.Map;

public interface SocketHandler {
  boolean supports(String type);
  Mono<Void> handle(WebSocketSession session, Map<String, Object> payload);
}
