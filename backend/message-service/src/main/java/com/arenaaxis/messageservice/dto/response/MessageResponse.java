package com.arenaaxis.messageservice.dto.response;

import com.arenaaxis.messageservice.model.Message;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageResponse {
  String id;
  String senderId;
  String content;
  String conversationId;

  LocalDateTime timestamp;
  Message.MessageStatus status;
}
