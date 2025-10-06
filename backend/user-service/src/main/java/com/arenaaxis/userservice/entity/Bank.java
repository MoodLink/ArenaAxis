package com.arenaaxis.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Bank {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  String name;

  @OneToOne(cascade = CascadeType.ALL)
  Media logo;
}
