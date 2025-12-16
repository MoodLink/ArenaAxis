package com.arenaaxis.messageservice.mapper;

import com.arenaaxis.messageservice.dto.response.StoreResponse;
import com.arenaaxis.messageservice.model.Store;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StoreMapper {
  StoreResponse toResponse(Store store);
}
