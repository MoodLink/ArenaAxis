package com.arenaaxis.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(
  indexes = {
    @Index(name = "index_store_owner_id", columnList = "owner_id"),
    @Index(name = "index_store_ward_id", columnList = "ward_id"),
    @Index(name = "index_store_province_id", columnList = "province_id"),
  }
)
public class Store {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  String name;
  String address;
  String linkGoogleMap;
  String introduction;

  Float latitude;
  Float longitude;

  LocalTime startTime;
  LocalTime endTime;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "owner_id", nullable = false, unique = true)
  User owner;

  @Builder.Default
  Boolean approved = false;

  @Builder.Default
  Boolean active = false;

  @Builder.Default
  Long viewCount = 0L;

  @Builder.Default
  Long orderCount = 0L;

  @Builder.Default
  LocalDateTime createdAt = LocalDateTime.now();

  @Builder.Default
  LocalDateTime updatedAt = LocalDateTime.now();
  LocalDateTime deletedAt;

  @OneToMany(mappedBy = "store")
  Set<Field> fields;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "province_id", nullable = false)
  Province province;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "ward_id", nullable = false)
  Ward ward;

  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "avatar_id")
  Media avatar;

  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "cover_image_id")
  Media coverImage;

  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "business_license_image_id")
  Media businessLicenseImage;

  @OneToMany(fetch = FetchType.EAGER, mappedBy = "store")
  Set<StoreMedia> medias;

  @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JoinColumn(name = "plan_id")
  MainPlan plan;

  @OneToMany(mappedBy = "store")
  Set<ApplyOptionalPlan> optionalPlans;

  @Builder.Default
  Float averageRating = 0F;
}
