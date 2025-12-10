package com.arenaaxis.messageservice.controller;

import com.arenaaxis.messageservice.model.Message;
import com.arenaaxis.messageservice.service.MessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/messages")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageController {
  MessageService messageService;

  @GetMapping
  public Mono<ResponseEntity<List<Message>>> getMessages(
    @RequestParam(required = false) String conversationId,
    @RequestParam(required = false, defaultValue = "0") int page,
    @RequestParam(required = false, defaultValue = "12") int perPage
  ) {
    return messageService.getMessagesByConversation(conversationId, page, perPage)
      .collectList()
      .map(ResponseEntity::ok);
  }
}
