package com.arenaaxis.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
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
  public static final int IMAGE_COUNT = 0;

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  String name;
  String address;

  @Column(columnDefinition = "TEXT")
  String linkGoogleMap;

  @Column(columnDefinition = "TEXT")
  String introduction;

  @Column(precision = 10, scale = 7)
  BigDecimal latitude;

  @Column(precision = 10, scale = 7)
  BigDecimal longitude;

  LocalTime startTime;
  LocalTime endTime;

  @ManyToOne
  @JoinColumn(name = "owner_id", nullable = false)
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
  LocalDateTime approvedAt;

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

  @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JoinColumn(name = "plan_id")
  MainPlan plan;

  @OneToMany(mappedBy = "store")
  Set<ApplyOptionalPlan> optionalPlans;

  @Builder.Default
  Float averageRating = 0F;

  @OneToMany(mappedBy = "store")
  Set<StoreHasSport> sports;

  @OneToMany(mappedBy = "store", fetch = FetchType.EAGER)
  Set<StoreUtility> utilities;

  public void increaseViewCount() {
    viewCount += 1;
  }

  public long increaseOrderCount() {
    orderCount += 1;
    return orderCount;
  }

  public boolean isApprovable() {
    if (Boolean.TRUE.equals(this.approved)) return false;
    if (this.plan == null) return false;
    if (this.medias.size() < IMAGE_COUNT) return false;
    if (this.avatar == null) return false;
    if (this.coverImage == null) return false;
    if (this.businessLicenseImage == null) return false;
    if (this.address == null) return false;
    if (this.introduction == null) return false;
    return this.linkGoogleMap != null;
  }
}
