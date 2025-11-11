package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.BankAccountRequest;
import com.arenaaxis.userservice.dto.response.BankAccountResponse;
import com.arenaaxis.userservice.entity.User;

public interface BankAccountService {
  BankAccountResponse createBankAccount(BankAccountRequest bankAccountRequest, User user);
  BankAccountResponse updateBankAccount(BankAccountRequest bankAccountRequest, User user);
  BankAccountResponse deleteBankAccount(User user);
  BankAccountResponse getById(String id);
  BankAccountResponse getByUser(User user);
}
