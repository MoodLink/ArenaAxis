package com.arenaaxis.messageservice.websocket.handler;

import com.arenaaxis.messageservice.model.Message;
import com.arenaaxis.messageservice.service.MessageService;
import com.arenaaxis.messageservice.service.ParticipantService;
import com.arenaaxis.messageservice.websocket.dto.request.MessageSocketRequest;
import com.arenaaxis.messageservice.websocket.dto.response.SeenMessageResponse;
import com.arenaaxis.messageservice.websocket.dto.response.SendMessageResponse;
import com.arenaaxis.messageservice.websocket.dto.response.WebSocketResponse;
import com.arenaaxis.messageservice.websocket.mapper.MessageSocketMapper;
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
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.function.BiFunction;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageHandler implements SocketHandler {
  MessageService messageService;
  ParticipantService participantService;
  MessageSocketMapper messageSocketMapper;
  ObjectMapper objectMapper;
  SessionRegistry sessionRegistry;

  @NonFinal
  Map<String, BiFunction<WebSocketSession, Map<String, Object>, Mono<Void>>> actions;

  @PostConstruct
  public void init() {
    actions = Map.of(
      "message.send", this::sendMessage,
      "message.received", this::markReceived
    );
  }

  @Override
  public boolean supports(String type) {
    return type.startsWith("message.");
  }

  @Override
  public Mono<Void> handle(WebSocketSession session, Map<String, Object> payload) {
    String type = payload.get("type").toString();

    return actions
      .getOrDefault(type, this::unknown)
      .apply(session, payload);
  }

  private Mono<Void> sendMessage(WebSocketSession session, Map<String, Object> payload) {
    String senderId =
      session.getAttributes().get("userId").toString();

    MessageSocketRequest request =
      objectMapper.convertValue(payload.get("data"), MessageSocketRequest.class);
    request.setSenderId(senderId);

    WebSocketSession receiver =
      sessionRegistry.get(request.getReceiverId());

    Message.MessageStatus status =
      isOnline(receiver)
        ? Message.MessageStatus.RECEIVED
        : Message.MessageStatus.SEND;

    request.setStatus(status);

    Message message =
      messageSocketMapper.fromRequest(request);

    return messageService
      .createMessage(request.getReceiverId(), message)
      .flatMap(this::mapToSendResponse)
      .flatMap(resp ->
        notifyReceiverIfNeeded(receiver, status, resp)
          .then(sendReceiveAckToSender(session, resp))
      );
  }

  private Mono<Void> markReceived(WebSocketSession session, Map<String, Object> payload) {
    String readerId =
      session.getAttributes().get("userId").toString();

    String messageId = ((Map<String, Object>) payload.get("data"))
      .get("messageId").toString();

    return messageService
      .seenMessage(messageId, readerId)
      .flatMap(message ->
        notifySenderMessageReceived(message, readerId)
      );
  }

  private Mono<Void> notifyReceiverIfNeeded(
    WebSocketSession receiver,
    Message.MessageStatus status,
    SendMessageResponse response
  ) {
    if (status != Message.MessageStatus.RECEIVED) {
      return Mono.empty();
    }

    WebSocketResponse<SendMessageResponse> wsResponse =
      WebSocketResponse.<SendMessageResponse>builder()
        .type("message.receive")
        .data(response)
        .build();

    return receiver.send(Mono.just(
      receiver.textMessage(writeJson(wsResponse))
    ));
  }

  private Mono<SendMessageResponse> mapToSendResponse(Message message) {
    return participantService.getParticipant(message.getSenderId())
      .map(sender -> SendMessageResponse.builder()
        .sender(sender)
        .content(message.getContent())
        .conversationId(message.getConversationId())
        .status(message.getStatus())
        .timestamp(message.getTimestamp())
        .build());
  }

  private Mono<SeenMessageResponse> mapToSeenResponse(Message message, String readerId) {
    return participantService.getParticipant(readerId)
      .map(reader -> SeenMessageResponse.builder()
        .reader(reader)
        .messageId(message.getId())
        .status(message.getStatus())
        .readAt(LocalDateTime.now())
        .conversationId(message.getConversationId())
        .build());
  }

  private Mono<Void> sendReceiveAckToSender(
    WebSocketSession session,
    SendMessageResponse response
  ) {
    WebSocketResponse<SendMessageResponse> ack =
      WebSocketResponse.<SendMessageResponse>builder()
        .type("message.send.ack")
        .data(response)
        .build();

    return session.send(Mono.just(
      session.textMessage(writeJson(ack))
    ));
  }

  private Mono<Void> notifySenderMessageReceived(
    Message message,
    String readerId
  ) {
    WebSocketSession sender = sessionRegistry.get(message.getSenderId());

    if (!isOnline(sender)) {
      return Mono.empty();
    }

    return mapToSeenResponse(message, readerId)
      .flatMap(seenResponse -> {
        WebSocketResponse<SeenMessageResponse> response =
          WebSocketResponse.<SeenMessageResponse>builder()
            .type("message.received")
            .data(seenResponse)
            .build();

        return sender.send(Mono.just(
          sender.textMessage(writeJson(response))
        ));
      });
  }

  private String writeJson(Object obj) {
    try {
      return objectMapper.writeValueAsString(obj);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  private boolean isOnline(WebSocketSession session) {
    return session != null && session.isOpen();
  }

  private Mono<Void> unknown(
    WebSocketSession session,
    Map<String, Object> payload
  ) {
    log.warn("Unknown message action: {}", payload.get("type"));
    return Mono.empty();
  }
}
