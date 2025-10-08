package com.arenaaxis.userservice.mapper;

import com.arenaaxis.userservice.dto.request.SportCreateRequest;
import com.arenaaxis.userservice.dto.request.SportUpdateRequest;
import com.arenaaxis.userservice.dto.response.SportResponse;
import com.arenaaxis.userservice.entity.Sport;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SportMapper {
  @Mapping(target = "id", ignore = true)
  Sport toSport(SportCreateRequest request);

  @Mapping(target = "id", ignore = true)
  void toSport(@MappingTarget Sport sport, SportUpdateRequest request);

  SportResponse toResponse(Sport sport);
}
