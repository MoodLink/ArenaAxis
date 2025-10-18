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
@Table(
  indexes = @Index(name = "ward_province_id", columnList = "province_id")
)
public class Ward {
  @Id
  String id;
  String name;
  String nameEn;
  Float latitude;
  Float longitude;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "province_id", nullable = false)
  Province province;
}
