package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.request.BankAccountRequest;
import com.arenaaxis.userservice.dto.response.BankAccountResponse;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.service.BankAccountService;
import com.arenaaxis.userservice.service.CurrentUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bank-accounts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BankAccountController {
  BankAccountService bankAccountService;
  CurrentUserService currentUserService;

  @PostMapping
  public ResponseEntity<BankAccountResponse> create(@RequestBody BankAccountRequest request) {
    User user = currentUserService.getCurrentUser();
    return ResponseEntity.ok(bankAccountService.createBankAccount(request, user));
  }

  @GetMapping("/{id}")
  public ResponseEntity<BankAccountResponse> get(@PathVariable String id) {
    return ResponseEntity.ok(bankAccountService.getById(id));
  }

  @GetMapping("/myself")
  public ResponseEntity<BankAccountResponse> getMyself() {
    User user = currentUserService.getCurrentUser();
    return ResponseEntity.ok(bankAccountService.getByUser(user));
  }

  @DeleteMapping("/myself")
  public ResponseEntity<BankAccountResponse> delete() {
    User user = currentUserService.getCurrentUser();
    return ResponseEntity.ok(bankAccountService.deleteBankAccount(user));
  }

  @PutMapping("/myself")
  public ResponseEntity<BankAccountResponse> update(@RequestBody BankAccountRequest request) {
    User user = currentUserService.getCurrentUser();
    return ResponseEntity.ok(bankAccountService.updateBankAccount(request, user));
  }
}
