package com.arenaaxis.messageservice.mapper;

import com.arenaaxis.messageservice.dto.response.MessageResponse;
import com.arenaaxis.messageservice.model.Message;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MessageMapper {
  MessageResponse toResponse(Message message);
}
