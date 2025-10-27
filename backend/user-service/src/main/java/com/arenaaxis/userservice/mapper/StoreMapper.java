package com.arenaaxis.userservice.mapper;

import com.arenaaxis.userservice.dto.request.StoreCreateRequest;
import com.arenaaxis.userservice.dto.response.StoreAdminDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreClientDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.entity.StoreMedia;
import java.util.Collections;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;

import java.util.List;
import java.util.Set;

@Mapper(
  componentModel = "spring",
  uses = {
    WardMapper.class,
    ProvinceMapper.class,
    UserMapper.class
  }
)
public interface StoreMapper {
  @Mapping(target = "active", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "deletedAt", ignore = true)
  @Mapping(target = "viewCount", ignore = true)
  @Mapping(target = "orderCount", ignore = true)
  @Mapping(target = "avatar", ignore = true)
  @Mapping(target = "coverImage", ignore = true)
  @Mapping(target = "businessLicenseImage", ignore = true)
  @Mapping(target = "medias", ignore = true)
  @Mapping(target = "plan", ignore = true)
  @Mapping(target = "optionalPlans", ignore = true)
  @Mapping(target = "approved", ignore = true)
  @Mapping(target = "owner", ignore = true)
  Store fromCreateRequest(StoreCreateRequest request);

  @Mapping(
    target = "avatarUrl",
    source = "avatar.url",
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
  )
  @Mapping(
    target = "coverImageUrl",
    source = "coverImage.url",
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
  )
  @Mapping(
    target = "businessLicenceImageUrl",
    source = "businessLicenseImage.url",
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
  )
  @Mapping(
    target = "mediaUrls",
    expression = "java(mapMediaUrls(store.getMedias()))"
  )
  @Mapping(target = "newToken", ignore = true)
  StoreAdminDetailResponse toAdminDetailResponse(Store store);

  @Mapping(
    target = "avatarUrl",
    source = "store.avatar.url",
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
  )
  @Mapping(
    target = "coverImageUrl",
    source = "store.coverImage.url",
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
  )
  @Mapping(
    target = "businessLicenceImageUrl",
    source = "store.businessLicenseImage.url",
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
  )
  @Mapping(
    target = "mediaUrls",
    expression = "java(mapMediaUrls(store.getMedias()))"
  )
  @Mapping(target = "newToken", expression = "java(newToken)")
  StoreAdminDetailResponse toAdminDetailResponse(Store store, String newToken);

  @Mapping(
    target = "avatarUrl",
    source = "avatar.url",
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
  )
  @Mapping(
    target = "coverImageUrl",
    source = "coverImage.url",
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
  )
  StoreClientDetailResponse toClientDetailResponse(Store store);

  @Mapping(
    target = "avatarUrl",
    source = "avatar.url",
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
  )
  @Mapping(
    target = "coverUrl",
    source = "coverImage.url",
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
  )
  StoreSearchItemResponse toStoreSearchItemResponse(Store store);

  default List<String> mapMediaUrls(Set<StoreMedia> medias) {
    if (medias == null) return Collections.emptyList();

    return medias.stream().map(media -> media.getMedia().getUrl()).toList();
  }
}
