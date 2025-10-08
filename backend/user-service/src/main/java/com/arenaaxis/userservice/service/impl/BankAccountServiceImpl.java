package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.request.BankAccountRequest;
import com.arenaaxis.userservice.dto.response.BankAccountResponse;
import com.arenaaxis.userservice.entity.Bank;
import com.arenaaxis.userservice.entity.BankAccount;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.mapper.BankAccountMapper;
import com.arenaaxis.userservice.repository.BankAccountRepository;
import com.arenaaxis.userservice.repository.BankRepository;
import com.arenaaxis.userservice.service.BankAccountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BankAccountServiceImpl implements BankAccountService {
  BankAccountRepository bankAccountRepository;
  BankRepository bankRepository;
  BankAccountMapper bankAccountMapper;

  @Override
  public BankAccountResponse createBankAccount(BankAccountRequest request, User user) {
    Bank bank = getBank(request.getBankId());
    BankAccount account = bankAccountMapper.toBankAccount(request);
    account.setUser(user);
    account.setBank(bank);
    account = bankAccountRepository.save(account);
    return bankAccountMapper.toResponse(account);
  }

  @Override
  public BankAccountResponse updateBankAccount(BankAccountRequest request, User user) {
    BankAccount account = bankAccountMapper.toBankAccount(request);
    Bank bank = getBank(request.getBankId());
    account.setBank(bank);
    account.setNumber(request.getNumber());
    account.setName(request.getName());
    account.setUpdatedAt(LocalDateTime.now());
    account = bankAccountRepository.save(account);
    return bankAccountMapper.toResponse(account);
  }

  @Override
  public BankAccountResponse deleteBankAccount(User user) {
    BankAccount account = user.getBankAccount();
    account.setDeletedAt(LocalDateTime.now());
    account = bankAccountRepository.save(account);
    return bankAccountMapper.toResponse(account);
  }

  @Override
  public BankAccountResponse getById(String id) {
    return bankAccountMapper.toResponse(bankAccountRepository.findById(id)
      .orElseThrow(() -> new AppException(ErrorCode.BANK_ACCOUNT_NOT_FOUND)));
  }

  @Override
  public BankAccountResponse getByUser(User user) {
    return bankAccountMapper.toResponse(user.getBankAccount());
  }

  Bank getBank(String bankId) {
    return bankRepository.findById(bankId)
      .orElseThrow(() -> new AppException(ErrorCode.BANK_NOT_FOUND));
  }
}
