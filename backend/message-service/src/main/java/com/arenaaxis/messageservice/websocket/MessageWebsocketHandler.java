package com.arenaaxis.messageservice.websocket;

import com.arenaaxis.messageservice.exception.AppException;
import com.arenaaxis.messageservice.exception.ErrorCode;
import com.arenaaxis.messageservice.model.Message;
import com.arenaaxis.messageservice.service.MessageService;
import com.arenaaxis.messageservice.websocket.dto.MessageSocketRequest;
import com.arenaaxis.messageservice.websocket.mapper.MessageSocketMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageWebsocketHandler implements WebSocketHandler {
  MessageService messageService;
  MessageSocketMapper messageMapper;
  ObjectMapper objectMapper;

  Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

  @Override
  public Mono<Void> handle(WebSocketSession session) {
    log.info("New WS session: {}", session.getId());
    return session.receive()
      .flatMap(webSocketMessage -> {
        try {
          Map<String, Object> map = objectMapper.readValue(
            webSocketMessage.getPayloadAsText(), Map.class
          );
          String type = map.get("type").toString();
          Mono<Void> handler = switch (type) {
            case "register" -> handleRegister(session, map);
            case "message" -> handleMessage(session, map);
            default -> {
              log.error("Unknown message type: {}", type);
              yield Mono.empty();
            }
          };
          return handler.onErrorResume(e -> {
            if (e instanceof AppException appEx &&
              appEx.getErrorCode().equals(ErrorCode.USER_NOT_FOUND)) {
              log.warn("User not found: {}", appEx.getMessage());
              return Mono.empty();
            }
            log.error("Unexpected error: {}", e.getMessage(), e);
            return Mono.empty();
          });
        } catch (Exception e) {
          log.error(e.getMessage(), e);
          return Mono.empty();
        }
      })
      .then()
      .doFinally(signalType -> removeSession(session));
  }

  private Mono<Void> handleRegister(WebSocketSession session, Map<String, Object> map) {
    String userId = map.get("userId").toString();
    sessions.put(userId, session);
    log.info("Registered user {}", userId);
    return Mono.empty();
  }

  private Mono<Void> handleMessage(WebSocketSession session, Map<String, Object> map) {
    MessageSocketRequest request = objectMapper.convertValue(map.get("data"), MessageSocketRequest.class);
    return tryToReceiver(request)
      .flatMap(status -> {
        request.setStatus(status);
        Message message = messageMapper.fromRequest(request);
        return messageService.createMessage(request.getReceiverId(), message);
      })
      .flatMap(saved -> {
        try {
          return session.send(Mono.just(session.textMessage(
            objectMapper.writeValueAsString(request)
          )));
        } catch (IOException e) {
          return Mono.error(e);
        }
      });
  }

  private Mono<Message.MessageStatus> tryToReceiver(MessageSocketRequest message) {
    var receiver = sessions.get(message.getReceiverId());
    if (receiver == null || !receiver.isOpen()) {
      return Mono.just(Message.MessageStatus.SEND);
    }
    log.info("Receiver found");
    log.info("Message: {}", message);

    String payload;
    try {
      payload = objectMapper.writeValueAsString(message);
    } catch (IOException e) {
      return Mono.just(Message.MessageStatus.SEND);
    }
    log.info("Payload {}", payload);

    return receiver
      .send(Mono.just(receiver.textMessage(payload)))
      .thenReturn(Message.MessageStatus.RECEIVED);
  }

  private void removeSession(WebSocketSession session) {
    sessions.entrySet().removeIf(entry -> entry.getValue().getId().equals(session.getId()));
    log.info("Session disconnected: {}", session.getId());
  }
}
