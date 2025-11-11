package com.arenaaxis.userservice.mapper;

import com.arenaaxis.userservice.dto.request.WardRequest;
import com.arenaaxis.userservice.dto.response.WardResponse;
import com.arenaaxis.userservice.entity.Ward;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WardMapper {
  WardResponse toResponse(Ward ward);
  Ward toWard(WardRequest request);
}
