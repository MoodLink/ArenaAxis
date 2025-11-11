package com.arenaaxis.userservice.specification;

import com.arenaaxis.userservice.dto.request.SearchStoreRequest;
import com.arenaaxis.userservice.entity.Field;
import com.arenaaxis.userservice.entity.Store;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class StoreSpecification {
  private StoreSpecification() {}

  public static Specification<Store> searchStores(SearchStoreRequest request) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (request.getName() != null && !request.getName().isBlank()) {
        predicates.add(cb.like(cb.lower(root.get("name")), stringPattern(request.getName())));
      }

      if (request.getAddress() != null && !request.getAddress().isBlank()) {
        predicates.add(cb.like(cb.lower(root.get("address")), stringPattern(request.getAddress())));
      }

      if (request.getWardId() != null && !request.getWardId().isBlank()) {
        predicates.add(cb.equal(root.get("ward").get("id"), request.getWardId()));
      }

      if (request.getProvinceId() != null && !request.getProvinceId().isBlank()) {
        predicates.add(cb.equal(root.get("province").get("id"), request.getProvinceId()));
      }

      Join<Store, Field> fieldJoin = null;
      if ((request.getSportId() != null && !request.getSportId().isBlank()) || request.getPrice() != null) {
        fieldJoin = root.join("fields", JoinType.INNER);
      }

      if (request.getSportId() != null && !request.getSportId().isBlank()) {
        predicates.add(cb.equal(Objects.requireNonNull(fieldJoin).get("sport").get("id"), request.getSportId()));
      }

      if (request.getPrice() != null) {
        if (request.getPrice().getMin() != null) {
          predicates.add(cb.greaterThanOrEqualTo(fieldJoin.get("defaultPrice"), request.getPrice().getMin()));
        }
        if (request.getPrice().getMax() != null) {
          predicates.add(cb.lessThanOrEqualTo(fieldJoin.get("defaultPrice"), request.getPrice().getMax()));
        }
      }

      Objects.requireNonNull(query).distinct(true);
      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  private static String stringPattern(String str) {
    return "%" + str.toLowerCase() + "%";
  }
}
