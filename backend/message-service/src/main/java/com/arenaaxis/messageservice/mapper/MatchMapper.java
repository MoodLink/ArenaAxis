package com.arenaaxis.messageservice.mapper;

import com.arenaaxis.messageservice.dto.response.MatchResponse;
import com.arenaaxis.messageservice.model.Match;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
  componentModel = "spring",
  uses = FieldMapper.class
)
public interface MatchMapper {
  @Mapping(target = "sport", ignore = true)
  MatchResponse toResponse(Match match);
}
