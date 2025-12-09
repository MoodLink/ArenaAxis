package com.arenaaxis.userservice.mapper;

import com.arenaaxis.userservice.dto.response.BankResponse;
import com.arenaaxis.userservice.entity.Bank;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BankMapper {
  @Mapping(target = "logoUrl", source = "logo.url")
  BankResponse toBankResponse(Bank bank);
}
