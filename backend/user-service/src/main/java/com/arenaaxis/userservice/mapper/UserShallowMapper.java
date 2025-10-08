package com.arenaaxis.userservice.mapper;

import com.arenaaxis.userservice.dto.response.UserResponse;
import com.arenaaxis.userservice.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface UserShallowMapper {
  @Named("toShallowBankAccountResponse")
  @Mapping(target = "bankAccount", ignore = true)
  UserResponse toShallowBankAccountResponse(User user);
}
