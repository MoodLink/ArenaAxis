package com.arenaaxis.userservice.entity;

import com.arenaaxis.userservice.entity.enums.Role;
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
@Table(
  indexes = {
    @Index(name = "index_email", columnList = "email")
  }
)
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @Column(unique = true, nullable = false)
  String email;
  String password;
  String phone;
  String name;
  boolean active;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "avatar_id")
  Media avatar;

  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "qr_code_id")
  Media qrCode;

  @OneToOne(mappedBy = "user")
  BankAccount bankAccount;

  @Builder.Default
  LocalDateTime createdAt = LocalDateTime.now();

  @Enumerated(EnumType.STRING)
  Role role;
}
