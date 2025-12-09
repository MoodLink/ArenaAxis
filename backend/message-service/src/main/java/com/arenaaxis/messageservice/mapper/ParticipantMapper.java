package com.arenaaxis.messageservice.mapper;

import com.arenaaxis.messageservice.client.dto.response.UserClientResponse;
import com.arenaaxis.messageservice.dto.request.UpdateParticipantRequest;
import com.arenaaxis.messageservice.dto.response.ParticipantResponse;
import com.arenaaxis.messageservice.model.Participant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ParticipantMapper {
  ParticipantResponse toResponse(Participant participant);
  Participant fromClient(UserClientResponse client);
  @Mapping(target = "id", ignore = true)
  void updateParticipantFromRequest(UpdateParticipantRequest request,
                                    @MappingTarget Participant participant);
}
