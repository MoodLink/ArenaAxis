package com.arenaaxis.userservice.mapper;

import com.arenaaxis.userservice.dto.response.RatingResponse;
import com.arenaaxis.userservice.entity.Rating;
import com.arenaaxis.userservice.entity.RatingMedia;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collections;
import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = {
  StoreMapper.class, SportMapper.class, UserMapper.class
})
public interface RatingMapper {
  @Mapping(target = "mediaUrls", expression = "java(mapMediaUrls(rating.getMedias()))")
  RatingResponse toResponse(Rating rating);

  default List<String> mapMediaUrls(Set<RatingMedia> medias) {
    if (medias == null) return Collections.emptyList();

    return medias.stream().map(media -> media.getMedia().getUrl()).toList();
  }
}
