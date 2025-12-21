package com.arenaaxis.userservice.mapper;

import com.arenaaxis.userservice.dto.request.SuspendStoreRequest;
import com.arenaaxis.userservice.dto.response.SuspendStoreResponse;
import com.arenaaxis.userservice.entity.SuspendStore;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {StoreMapper.class, UserMapper.class})
public interface SuspendStoreMapper {
  SuspendStoreResponse toResponse(SuspendStore suspendStore);

  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "deletedAt", ignore = true)
  @Mapping(target = "store", ignore = true)
  @Mapping(target = "operator", ignore = true)
  @Mapping(target = "id", ignore = true)
  SuspendStore fromRequest(SuspendStoreRequest suspendStoreRequest);

  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "deletedAt", ignore = true)
  @Mapping(target = "operator", ignore = true)
  void fromRequest(@MappingTarget SuspendStore suspendStore, SuspendStoreRequest request);
}
