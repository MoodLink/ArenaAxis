package com.arenaaxis.userservice.mapper;

import com.arenaaxis.userservice.dto.response.ProvinceResponse;
import com.arenaaxis.userservice.entity.Province;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProvinceMapper {
  ProvinceResponse toResponse(Province province);
}
