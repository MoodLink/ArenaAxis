package com.arenaaxis.messageservice.mapper;

import com.arenaaxis.messageservice.dto.response.PostFieldResponse;
import com.arenaaxis.messageservice.model.Match;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FieldMapper {
  PostFieldResponse toResponse(Match.Field field);
}
