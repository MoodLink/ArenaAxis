package com.arenaaxis.userservice.specification;

import com.arenaaxis.userservice.dto.request.SearchStoreRequest;
import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.entity.StoreHasSport;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class StoreSpecification {
  private StoreSpecification() {}

  public static Specification<Store> searchStores(SearchStoreRequest request) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();
      settingPredicate(predicates, request, root, cb);

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

  private static String stringPattern(String str) {
    return "%" + str.toLowerCase() + "%";
  }
}
