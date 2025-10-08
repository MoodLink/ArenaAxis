package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.dto.request.BankRequest;
import com.arenaaxis.userservice.dto.response.BankResponse;

import java.util.List;

public interface BankService {
  BankResponse create(BankRequest request);
  BankResponse getBankById(String id);
  BankResponse updateBankById(String id, BankRequest request);
  List<BankResponse> getAllBanks();
  BankResponse deleteBankById(String id);
}
