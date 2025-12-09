package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.request.BankRequest;
import com.arenaaxis.userservice.dto.response.BankResponse;
import com.arenaaxis.userservice.entity.Bank;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.mapper.BankMapper;
import com.arenaaxis.userservice.repository.BankRepository;
import com.arenaaxis.userservice.service.MediaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BankServiceImplTest {
  @Mock
  BankRepository bankRepository;
  @Mock
  BankMapper bankMapper;
  @Mock
  MediaService mediaService;

  @InjectMocks
  BankServiceImpl bankServiceImpl;

  String id;
  String name;
  MockMultipartFile logo;
  String logoUrl;

  @BeforeEach
  void setup() {
    id = UUID.randomUUID().toString();
    name = "MB-Bank";
    logo = new MockMultipartFile(
      "logo", "logo.png", "image/png", "logo".getBytes()
    );
    logoUrl = "https://cloudinary.com/logo.png";
  }

  @Test
  void create_withoutLogo_should_saveBank_and_returnResponse() {
    BankRequest req = BankRequest.builder().name(name).build();
    BankResponse expectedResponse = BankResponse.builder().name(name).logoUrl(null).build();
    when(bankMapper.toBankResponse(any(Bank.class))).thenReturn(expectedResponse);

    BankResponse actualResponse = bankServiceImpl.create(req);
    assertSame(expectedResponse, actualResponse);
    verify(bankRepository).save(any(Bank.class));
    verify(mediaService, never()).uploadAndUpdateLogoToBank(any(Bank.class), any());
  }

  @Test
  void create_withLogo_should_saveBank_and_returnResponse() {
    BankRequest req = BankRequest.builder().name(name).logo(logo).build();
    BankResponse expectedResponse = mock(BankResponse.class);
    when(bankMapper.toBankResponse(any(Bank.class))).thenReturn(expectedResponse);

    bankServiceImpl.create(req);
    verify(bankRepository).save(any(Bank.class));
    verify(mediaService, times(1)).uploadAndUpdateLogoToBank(any(Bank.class), eq(logo));
  }

  @Test
  void getBankById_whenFound_returnsResponse() {
    Bank bank = Bank.builder().id(id).name(name).build();
    BankResponse expectedResponse = mock(BankResponse.class);
    when(bankRepository.findById(id)).thenReturn(Optional.of(bank));
    when(bankMapper.toBankResponse(any(Bank.class))).thenReturn(expectedResponse);

    BankResponse actualResponse = bankServiceImpl.getBankById(id);
    assertSame(expectedResponse, actualResponse);
  }

  @Test
  void getBankById_whenNotFound_returnsResponse() {
    when(bankRepository.findById(id)).thenReturn(Optional.empty());
    AppException exp = assertThrows(
      AppException.class,
      () -> bankServiceImpl.getBankById(id)
    );

    assertEquals(ErrorCode.BANK_NOT_FOUND, exp.getErrorCode());
    verify(bankRepository).findById(id);
  }

  @Test
  void updateBankById_whenFound_updates_and_callsMedia_ifLogoPresent() {
    String newName = "Name2";

    Bank bank = Bank.builder().id(id).name(name).build();
    BankRequest req = BankRequest.builder().name(newName).logo(logo).build();
    BankResponse expectedResponse = BankResponse.builder().name(newName).logoUrl(logoUrl).build();

    when(bankRepository.findById(id)).thenReturn(Optional.of(bank));
    when(bankMapper.toBankResponse(any(Bank.class))).thenReturn(expectedResponse);

    BankResponse actualResponse = bankServiceImpl.updateBankById(id, req);
    assertSame(expectedResponse, actualResponse);
    verify(bankRepository).save(bank);
    verify(mediaService).uploadAndUpdateLogoToBank(bank, logo);
    assertEquals(newName, actualResponse.getName());
  }

  @Test
  void updateBankById_whenNotFound_throws() {
    when(bankRepository.findById(any(String.class))).thenReturn(Optional.empty());
    BankRequest req = BankRequest.builder().name(name).logo(null).build();
    var exp = assertThrows(AppException.class, () -> bankServiceImpl.updateBankById(id, req));

    assertEquals(ErrorCode.BANK_NOT_FOUND, exp.getErrorCode());
    verify(bankRepository).findById(id);
  }

  @Test
  void getAllBanks_mapsAll() {
    Bank bank = Bank.builder().id(id).name(name).build();
    BankResponse resp = mock(BankResponse.class);
    when(bankRepository.findAll()).thenReturn(List.of(bank));
    when(bankMapper.toBankResponse(any(Bank.class))).thenReturn(resp);

    var list = bankServiceImpl.getAllBanks();
    assertEquals(1, list.size());
    assertEquals(resp, list.get(0));
  }

  @Test
  void deleteBankById_whenFound_callsDeleteLogo_and_repositoryDelete() {
    Bank bank = Bank.builder().id(id).name(name).build();
    BankResponse resp = mock(BankResponse.class);
    when(bankRepository.findById(id)).thenReturn(Optional.of(bank));
    when(bankMapper.toBankResponse(any(Bank.class))).thenReturn(resp);

    BankResponse actualResponse = bankServiceImpl.deleteBankById(id);
    assertSame(resp, actualResponse);
    verify(mediaService).deleteBankLogo(bank);
    verify(bankRepository).delete(bank);

  }

  @Test
  void deleteBankById_whenNotFound_throws() {
    when(bankRepository.findById(any(String.class))).thenReturn(Optional.empty());
    var exp = assertThrows(AppException.class, () -> bankServiceImpl.deleteBankById(id));

    assertEquals(ErrorCode.BANK_NOT_FOUND, exp.getErrorCode());
    verify(bankRepository).findById(id);
  }
}