package com.arenaaxis.userservice.mapper;

import com.arenaaxis.userservice.dto.response.MainPlanResponse;
import com.arenaaxis.userservice.entity.MainPlan;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MainPlanMapper {
  MainPlanResponse toResponse(MainPlan mainPlan);
}
