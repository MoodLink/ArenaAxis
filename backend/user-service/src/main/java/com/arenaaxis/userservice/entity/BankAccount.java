package com.arenaaxis.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(indexes = {
    @Index(name = "index_number", columnList = "number"),
    @Index(name = "index_bank_account_user", columnList = "user_id")
})
public class BankAccount {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  String name;
  String number;

  @ManyToOne(fetch = FetchType.EAGER)
  Bank bank;

  @OneToOne
  @JoinColumn(name = "user_id", unique = true)
  User user;

  @Builder.Default
  LocalDateTime createdAt = LocalDateTime.now();

  @Builder.Default
  LocalDateTime updatedAt = LocalDateTime.now();

  LocalDateTime deletedAt;
}
