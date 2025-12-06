package com.arenaaxis.userservice.specification;

import com.arenaaxis.userservice.dto.request.NearbyRequest;
import com.arenaaxis.userservice.dto.request.SearchStoreRequest;
import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.entity.StoreHasSport;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class StoreSpecification {
  private static final float DISTANCE_DEFAULT = 10000;

  private StoreSpecification() {}

  public static Specification<Store> recommendStores(NearbyRequest request) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();
      if (request.getLatitude() != null && request.getLongitude() != null) {
        float distance = DISTANCE_DEFAULT;
        if (request.getDistance() != null) {
          distance = request.getDistance();
        }

        settingDistance(predicates, request.getLatitude(), request.getLongitude(), distance, root, cb);
      } else if (request.getWardName() != null) {
        settingNameWard(predicates, request.getWardName(), root, cb);
      } else if (request.getProvinceName() != null) {
        settingProvinceName(predicates, request.getProvinceName(), root, cb);
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  public static Specification<Store> searchStores(SearchStoreRequest request) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();
      settingPredicate(predicates, request, root, cb);
      settingApprovable(predicates, request, root, cb);

      Objects.requireNonNull(query).distinct(true);
      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  public static Specification<Store> searchStoreInIds(SearchStoreRequest request, List<String> ids) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();
      if (ids != null && !ids.isEmpty()) {
        predicates.add(root.get("id").in(ids));
      } else {
        predicates.add(cb.equal(cb.literal(1), 0));
      }

      settingPredicate(predicates, request, root, cb);
      Objects.requireNonNull(query).distinct(true);
      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  private static void settingPredicate(List<Predicate> predicates, SearchStoreRequest request,
                                       Root<Store> root, CriteriaBuilder cb) {
    if (request.getName() != null && !request.getName().isBlank()) {
      predicates.add(cb.like(cb.lower(root.get("name")), stringPattern(request.getName())));
    }

    if (request.getWardId() != null && !request.getWardId().isBlank()) {
      predicates.add(cb.equal(root.get("ward").get("id"), request.getWardId()));
    }

    if (request.getProvinceId() != null && !request.getProvinceId().isBlank()) {
      predicates.add(cb.equal(root.get("province").get("id"), request.getProvinceId()));
    }

    if (request.getSportId() != null && !request.getSportId().isEmpty()) {
      Join<Store, StoreHasSport> sportJoin = root.join("sports");
      predicates.add(cb.and(
        cb.equal(sportJoin.get("sport").get("id"), request.getSportId()),
        cb.isTrue(sportJoin.get("hasSport"))
      ));
    }
  }

  private static void settingApprovable(List<Predicate> predicates, SearchStoreRequest request,
                                        Root<Store> root, CriteriaBuilder cb) {
    if (!request.isApprovable()) return;

    List<String> notNullFields = List.of(
      "plan",
      "avatar",
      "coverImage",
      "introduction",
      "businessLicenseImage",
      "linkGoogleMap",
      "address"
    );
    predicates.add(cb.isFalse(root.get("approved")));
    notNullFields.forEach(field -> predicates.add(cb.isNotNull(root.get(field))));
    predicates.add(cb.greaterThanOrEqualTo(cb.size(root.get("medias")), Store.IMAGE_COUNT));
  }

  private static void settingNameWard(List<Predicate> predicates, String wardName,
                                      Root<Store> root, CriteriaBuilder cb) {
    if (wardName == null) return;

    predicates.add(cb.like(root.get("ward").get("nameEn"), stringPattern(wardName)));
  }

  private static void settingProvinceName(List<Predicate> predicates, String provName,
                                          Root<Store> root, CriteriaBuilder cb) {
    if (provName == null) return;

    predicates.add(cb.like(root.get("province").get("nameEn"), stringPattern(provName)));
  }

  private static void settingDistance(List<Predicate> predicates, Float latitude, Float longitude,
                                      Float distance, Root<Store> root, CriteriaBuilder cb) {
    if (latitude == null || longitude == null) return;

    Expression<Double> userPoint = cb.function(
      "point", Double.class,
      cb.literal(longitude),
      cb.literal(latitude)
    );

    Expression<Double> storePoint = cb.function(
      "point", Double.class,
      root.get("longitude"),
      root.get("latitude")
    );

    Expression<Double> distanceMeters = cb.function(
      "ST_Distance_Sphere",
      Double.class,
      storePoint,
      userPoint
    );

    predicates.add(cb.le(distanceMeters, distance));
  }

  private static String stringPattern(String str) {
    return "%" + str.toLowerCase() + "%";
  }
}
