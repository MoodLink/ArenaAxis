package com.arenaaxis.messageservice.websocket.mapper;

import com.arenaaxis.messageservice.model.Message;
import com.arenaaxis.messageservice.websocket.dto.MessageSocketRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MessageSocketMapper {
  @Mapping(target = "conversationId", ignore = true)
  Message fromRequest(MessageSocketRequest request);
}
