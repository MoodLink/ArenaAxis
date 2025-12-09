package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.request.BankRequest;
import com.arenaaxis.userservice.dto.response.BankResponse;
import com.arenaaxis.userservice.entity.Bank;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.mapper.BankMapper;
import com.arenaaxis.userservice.repository.BankRepository;
import com.arenaaxis.userservice.service.BankService;
import com.arenaaxis.userservice.service.MediaService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BankServiceImpl implements BankService {
  BankRepository bankRepository;
  BankMapper bankMapper;
  MediaService mediaService;

  @Override
  public BankResponse create(BankRequest request) {
    Bank bank = Bank.builder().name(request.getName()).build();
    bankRepository.save(bank);

    if (request.getLogo() != null) {
      mediaService.uploadAndUpdateLogoToBank(bank, request.getLogo());
    }
    return bankMapper.toBankResponse(bank);
  }

  @Override
  public BankResponse getBankById(String id) {
    return bankRepository.findById(id).map(bankMapper::toBankResponse)
      .orElseThrow(() -> new AppException(ErrorCode.BANK_NOT_FOUND));
  }

  @Override
  public BankResponse updateBankById(String id, BankRequest request) {
    Bank bank = bankRepository.findById(id)
      .orElseThrow(() -> new AppException(ErrorCode.BANK_NOT_FOUND));
    bank.setName(request.getName());
    bankRepository.save(bank);

    if (request.getLogo() != null) {
      mediaService.uploadAndUpdateLogoToBank(bank, request.getLogo());
    }
    return bankMapper.toBankResponse(bank);
  }

  @Override
  public List<BankResponse> getAllBanks() {
    return bankRepository.findAll()
      .stream()
      .map(bankMapper::toBankResponse)
      .toList();
  }

  @Override
  public BankResponse deleteBankById(String id) {
    Bank bank = bankRepository.findById(id)
      .orElseThrow(() -> new AppException(ErrorCode.BANK_NOT_FOUND));
    mediaService.deleteBankLogo(bank);
    bankRepository.delete(bank);
    return bankMapper.toBankResponse(bank);
  }
}
