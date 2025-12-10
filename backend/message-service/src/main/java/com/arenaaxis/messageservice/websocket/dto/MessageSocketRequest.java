package com.arenaaxis.messageservice.websocket.dto;

import com.arenaaxis.messageservice.model.Message;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageSocketRequest {
  String senderId;
  String receiverId;
  String content;
  Message.MessageStatus status;
}
