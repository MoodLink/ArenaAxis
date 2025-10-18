package com.arenaaxis.userservice.mapper;

import com.arenaaxis.userservice.dto.request.BankAccountRequest;
import com.arenaaxis.userservice.dto.response.BankAccountResponse;
import com.arenaaxis.userservice.entity.BankAccount;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = {BankMapper.class, UserShallowMapper.class})
public interface BankAccountMapper {
  @Mapping(target = "bank", ignore = true)
  @Mapping(target = "id", ignore = true)
  BankAccount toBankAccount(BankAccountRequest request);

  @Mapping(target = "user", qualifiedByName = "toShallowBankAccountResponse")
  BankAccountResponse toResponse(BankAccount bankAccount);

  @Named("toShallowUserResponse")
  @Mapping(target = "user", ignore = true)
  BankAccountResponse toShallowUserResponse(BankAccount bankAccount);
}
