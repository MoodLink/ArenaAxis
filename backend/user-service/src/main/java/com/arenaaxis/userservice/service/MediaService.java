package com.arenaaxis.userservice.service;

import com.arenaaxis.userservice.entity.Bank;
import org.springframework.web.multipart.MultipartFile;

public interface MediaService {
  void uploadAndUpdateLogoToBank(Bank bank, MultipartFile logo);
  void deleteBankLogo(Bank bank);
}