package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.entity.Bank;
import com.arenaaxis.userservice.entity.Media;
import com.arenaaxis.userservice.repository.BankRepository;
import com.arenaaxis.userservice.repository.MediaRepository;
import com.arenaaxis.userservice.service.MediaService;
import com.arenaaxis.userservice.utility.MediaUtility;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MediaServiceImpl implements MediaService {
  BankRepository bankRepository;
  MediaRepository mediaRepository;
  MediaUtility mediaUtility;

  @Async
  @Override
  public void uploadAndUpdateLogoToBank(Bank bank, @NotNull MultipartFile logoFile) {
    if (bank.getLogo() != null) {
      mediaUtility.delete(bank.getLogo());
    }

    Media logo = mediaUtility.upload(logoFile);
    mediaRepository.save(logo);
    bank.setLogo(logo);
    bankRepository.save(bank);
  }

  @Async
  @Override
  public void deleteBankLogo(Bank bank) {
    if (bank.getLogo() == null) return;

    mediaRepository.delete(bank.getLogo());
  }
}
