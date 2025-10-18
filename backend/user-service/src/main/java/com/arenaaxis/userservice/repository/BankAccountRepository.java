package com.arenaaxis.userservice.repository;

import com.arenaaxis.userservice.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, String> {
  Optional<BankAccount> findByNumberAndBank_Id(String number, String bankId);
}
