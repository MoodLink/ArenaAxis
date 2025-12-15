package com.arenaaxis.messageservice.mapper;

import com.arenaaxis.messageservice.dto.request.PostCreateRequest;
import com.arenaaxis.messageservice.dto.response.PostResponse;
import com.arenaaxis.messageservice.model.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
  componentModel = "spring",
  uses = {
    ParticipantMapper.class,
    MatchMapper.class,
    StoreMapper.class
  }
)
public interface PostMapper {
  @Mapping(target = "timestamp", ignore = true)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "pricePerPerson", ignore = true)
  @Mapping(target = "active", ignore = true)
  @Mapping(target = "comments", ignore = true)
  @Mapping(target = "participantIds", ignore = true)
  @Mapping(target = "matchIds", ignore = true)
  Post fromRequest(PostCreateRequest request);

  @Mapping(target = "pricePerPerson", source = "pricePerPerson")
  PostResponse toResponse(Post post);
}
