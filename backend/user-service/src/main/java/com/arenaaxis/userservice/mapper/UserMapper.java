package com.arenaaxis.userservice.mapper;

import com.arenaaxis.userservice.dto.request.UserCreateRequest;
import com.arenaaxis.userservice.dto.response.UserResponse;
import com.arenaaxis.userservice.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;

@Mapper(componentModel = "spring", uses = {BankAccountMapper.class})
public interface UserMapper {
  @Mapping(target = "avatar", ignore = true)
  @Mapping(target = "active", ignore = true)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "bankAccount", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "role", ignore = true)
  User toUser(UserCreateRequest request);

  @Mapping(
    source = "avatar.url",
    target = "avatarUrl",
    nullValueCheckStrategy =  NullValueCheckStrategy.ALWAYS
  )
  @Mapping(target = "bankAccount", qualifiedByName = "toShallowUserResponse")
  UserResponse toUserResponse(User user);
}
