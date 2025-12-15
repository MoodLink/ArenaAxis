package com.arenaaxis.messageservice.websocket.dto.response;

import com.arenaaxis.messageservice.model.Message;
import com.arenaaxis.messageservice.model.Participant;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendMessageResponse {
  Participant sender;
  String content;
  String conversationId;
  Message.MessageStatus status;
  LocalDateTime timestamp;
}
