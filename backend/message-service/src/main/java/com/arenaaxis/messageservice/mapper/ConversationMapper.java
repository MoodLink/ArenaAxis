package com.arenaaxis.messageservice.mapper;

import com.arenaaxis.messageservice.dto.response.ConversationResponse;
import com.arenaaxis.messageservice.model.Conversation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = MessageMapper.class)
public interface ConversationMapper {
  @Mapping(target = "participants", ignore = true)
  ConversationResponse toResponse(Conversation conversation);
}
