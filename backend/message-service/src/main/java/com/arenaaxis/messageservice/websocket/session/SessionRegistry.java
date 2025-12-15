package com.arenaaxis.messageservice.websocket.session;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketSession;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionRegistry {
  private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

  public void register(String userId, WebSocketSession session) {
    sessions.put(userId, session);
  }

  public WebSocketSession get(String userId) {
    return sessions.get(userId);
  }

  public void remove(WebSocketSession session) {
    sessions.entrySet().removeIf(entry -> entry.getValue() == session);
  }
}
