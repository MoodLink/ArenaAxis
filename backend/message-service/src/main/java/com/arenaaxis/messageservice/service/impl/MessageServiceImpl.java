package com.arenaaxis.messageservice.service.impl;

import com.arenaaxis.messageservice.exception.AppException;
import com.arenaaxis.messageservice.exception.ErrorCode;
import com.arenaaxis.messageservice.model.Conversation;
import com.arenaaxis.messageservice.model.Message;
import com.arenaaxis.messageservice.repository.ConversationRepository;
import com.arenaaxis.messageservice.repository.MessageRepository;
import com.arenaaxis.messageservice.service.MessageService;
import com.arenaaxis.messageservice.service.ParticipantService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageServiceImpl implements MessageService {
  ParticipantService participantService;

  ConversationRepository conversationRepository;
  MessageRepository messageRepository;

  @Override
  public Mono<Message> createMessage(String receiverId, Message message) {
    return participantService.createFromUserId(receiverId)
      .onErrorResume(ex -> Mono.error(new AppException(ErrorCode.USER_NOT_FOUND)))
      .then(participantService.createFromUserId(message.getSenderId())
        .onErrorResume(ex -> Mono.error(new AppException(ErrorCode.USER_NOT_FOUND))))
      .then(conversationRepository
        .findOneToOne(message.getSenderId(), receiverId)
        .switchIfEmpty(createNewConversation(message.getSenderId(), receiverId))
        .flatMap(conv -> {
          message.setConversationId(conv.getId());
          return updateConversation(conv, message)
            .then(messageRepository.save(message));
        })
      );
  }

  @Override
  public Mono<Message> seenMessage(String messageId, String readerId) {
    return messageRepository.findById(messageId)
      .switchIfEmpty(Mono.error(new AppException(ErrorCode.MESSAGE_NOT_FOUND)))
      .flatMap(message -> {
        if (!message.getSenderId().equals(readerId)) {
          return Mono.error(new AppException(ErrorCode.FORBIDDEN));
        }

        if (message.getStatus() == Message.MessageStatus.RECEIVED) {
          return Mono.just(message);
        }

        message.setStatus(Message.MessageStatus.RECEIVED);
        return messageRepository.save(message)
          .flatMap(savedMessage ->
            conversationRepository.findById(savedMessage.getConversationId())
              .flatMap(conv -> {
                if (conv.getLastMessage() != null &&
                  conv.getLastMessage().getId().equals(savedMessage.getId())) {
                  conv.setLastMessage(savedMessage);
                  conv.setLastMessageAt(savedMessage.getTimestamp());
                  return conversationRepository.save(conv)
                    .thenReturn(savedMessage);
                }

                return Mono.just(savedMessage);
              })
          );
      });
  }

  private Mono<Conversation> createNewConversation(String senderId, String receiverId) {
    Conversation conversation = Conversation.builder()
      .participantIds(List.of(senderId, receiverId))
      .lastMessage(null)
      .lastMessageAt(LocalDateTime.now())
      .build();

    return conversationRepository.save(conversation);
  }

  private Mono<Conversation> updateConversation(Conversation conv, Message msg) {
    conv.setLastMessage(msg);
    conv.setLastMessageAt(msg.getTimestamp());
    return conversationRepository.save(conv);
  }

  @Override
  public Flux<Message> getMessagesByConversation(String conversationId, int page, int perPage) {
    return messageRepository.findByConversationIdOrderByTimestampAsc(conversationId)
      .skip((long) page * perPage)
      .take(perPage);
  }
}
