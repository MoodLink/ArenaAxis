package com.arenaaxis.userservice.mapper;

import com.arenaaxis.userservice.dto.response.StoreUtilityResponse;
import com.arenaaxis.userservice.entity.StoreUtility;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StoreUtilityMapper {
  @Mapping(target = "expiredAt", source = "deletedAt")
  StoreUtilityResponse toResponse(StoreUtility storeUtility);
}
