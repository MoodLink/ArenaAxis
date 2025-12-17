package com.arenaaxis.messageservice.websocket.handler;

import com.arenaaxis.messageservice.dto.request.ApplyPostRequest;
import com.arenaaxis.messageservice.dto.response.ApplyPostResponse;
import com.arenaaxis.messageservice.dto.response.ApplyResponse;
import com.arenaaxis.messageservice.service.PostService;
import com.arenaaxis.messageservice.websocket.dto.request.ApplyPostSocketRequest;
import com.arenaaxis.messageservice.websocket.dto.response.WebSocketResponse;
import com.arenaaxis.messageservice.websocket.session.SessionRegistry;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostHandler implements SocketHandler{
  PostService postService;
  private final ObjectMapper objectMapper;
  private final SessionRegistry sessionRegistry;

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
    String applierId = session.getAttributes().get("userId").toString();

    ApplyPostSocketRequest socketRequest = objectMapper
      .convertValue(payload.get("data"), ApplyPostSocketRequest.class);

    ApplyPostRequest request = ApplyPostRequest.builder()
      .userId(applierId)
      .postId(socketRequest.getPostId())
      .number(socketRequest.getNumber())
      .build();
    return postService.applyPost(request)
      .flatMap(this::notifyPosterIfNeeded)
      .then()
      .doOnNext(applyResponse -> log.info("Response " + writeJson(applyResponse)))
      .doOnError(ex -> log.error("Apply post error", ex));
  }

  private Mono<Void> notifyPosterIfNeeded(ApplyResponse applyResponse) {
    WebSocketResponse<ApplyResponse> response = WebSocketResponse.<ApplyResponse>builder()
      .type("message.apply")
      .data(applyResponse)
      .build();

    List<String> receiverIds = new ArrayList<>(
      applyResponse.getPost().getParticipantIds() == null
        ? List.of()
        : applyResponse.getPost().getParticipantIds()
    );

    receiverIds.add(applyResponse.getPost().getPoster().getId());

    return Flux.fromIterable(receiverIds)
      .filter(id -> !id.equals(applyResponse.getApplier().getId()))
      .distinct()
      .flatMap(id -> Mono.justOrEmpty(sessionRegistry.get(id)))
      .filter(this::isOnline)
      .flatMap(session ->
        session.send(
          Mono.just(session.textMessage(writeJson(response)))
        )
      )
      .doOnError(ex -> log.error("Log receive apply event", ex.fillInStackTrace()))
      .then();
  }

  private boolean isOnline(WebSocketSession session) {
    return session != null && session.isOpen();
  }

  private String writeJson(Object obj) {
    try {
      return objectMapper.writeValueAsString(obj);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
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
