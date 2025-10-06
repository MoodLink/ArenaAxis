package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.request.BankRequest;
import com.arenaaxis.userservice.dto.response.BankResponse;
import com.arenaaxis.userservice.service.BankService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/banks")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BankController {
  BankService bankService;

  @PostMapping
  public ResponseEntity<BankResponse> create(
    @RequestParam("name") String name,
    @RequestParam(value = "logo", required = false) MultipartFile logo
  ) {
    BankRequest request = BankRequest.builder().name(name).logo(logo).build();
    return ResponseEntity.ok(bankService.create(request));
  }

  @GetMapping
  public ResponseEntity<List<BankResponse>> getAll() {
    return ResponseEntity.ok(bankService.getAllBanks());
  }

  @GetMapping("/{id}")
  public ResponseEntity<BankResponse> getById(@PathVariable String id) {
    return ResponseEntity.ok(bankService.getBankById(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<BankResponse> update(
    @PathVariable String id,
    @RequestParam("name") String name,
    @RequestParam(value = "logo", required = false) MultipartFile logo
  ) {
    BankRequest request = BankRequest.builder().name(name).logo(logo).build();
    return ResponseEntity.ok(bankService.updateBankById(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<BankResponse> delete(@PathVariable String id) {
    return ResponseEntity.ok(bankService.deleteBankById(id));
  }
}
