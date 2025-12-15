package com.arenaaxis.messageservice.websocket.handler;

import com.arenaaxis.messageservice.service.PostService;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.function.BiFunction;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostHandler implements SocketHandler{
  PostService postService;

  @NonFinal
  Map<String, BiFunction<WebSocketSession, Map<String, Object>, Mono<Void>>> actions;

  @PostConstruct
  public void init() {
    actions = Map.of(
      "post.apply", this::apply,
      "post.comment", this::comment
    );
  }

  @Override
  public boolean supports(String type) {
    return type.startsWith("post.");
  }

  @Override
  public Mono<Void> handle(WebSocketSession session, Map<String, Object> payload) {
    String type = payload.get("type").toString();

    return actions
      .getOrDefault(type, this::unknown)
      .apply(session, payload);
  }

  private Mono<Void> apply(WebSocketSession session, Map<String, Object> payload) {
    return null;
  }

  private Mono<Void> comment(WebSocketSession session, Map<String, Object> payload) {
    return null;
  }

  private Mono<Void> unknown(
    WebSocketSession session,
    Map<String, Object> payload
  ) {
    log.warn("Unknown post action: {}", payload.get("type"));
    return Mono.empty();
  }
}
