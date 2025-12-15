package com.arenaaxis.messageservice.websocket;

import com.arenaaxis.messageservice.websocket.handler.SocketHandler;
import com.arenaaxis.messageservice.websocket.session.SessionRegistry;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageWebsocketHandler implements WebSocketHandler {
  ObjectMapper objectMapper;
  List<SocketHandler> handlers;
  SessionRegistry sessionRegistry;

  @Override
  public Mono<Void> handle(WebSocketSession session) {
    log.info("New WS session: {}", session.getId());
    return session.receive()
      .flatMap(webSocketMessage -> {
        try {
          Map<String, Object> payload = objectMapper.readValue(
            webSocketMessage.getPayloadAsText(), Map.class
          );
          String type = payload.get("type").toString();

          if ("register".equals(type)) {
            String userId = payload.get("userId").toString();
            session.getAttributes().put("userId", userId);
            sessionRegistry.register(userId, session);
            log.info("Registered user {}", userId);
            return Mono.empty();
          }

          return handlers.stream()
            .filter(h -> h.supports(type))
            .findFirst()
            .map(h -> h.handle(session, payload))
            .orElseGet(() -> {
              log.warn("No handler for type {}", type);
              return Mono.empty();
            });
        } catch (Exception e) {
          log.error(e.getMessage(), e);
          return Mono.empty();
        }
      })
      .doFinally(signal -> {
        sessionRegistry.remove(session);
        log.info("WS disconnected: {}", session.getId());
      })
      .then();
  }
}
