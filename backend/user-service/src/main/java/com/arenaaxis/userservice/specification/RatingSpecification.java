package com.arenaaxis.userservice.specification;

import com.arenaaxis.userservice.dto.request.SearchRatingRequest;
import com.arenaaxis.userservice.entity.Rating;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class RatingSpecification {
  private RatingSpecification() {}

  public static Specification<Rating> searchRating(SearchRatingRequest request) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();
      settingSport(predicates, request, root, cb);
      settingStore(predicates, request, root, cb);

      Objects.requireNonNull(query).distinct(true);
      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  private static void settingSport(List<Predicate> predicates, SearchRatingRequest request,
                                   Root<Rating> root, CriteriaBuilder cb) {
    if (request.getSportId() != null) {
      predicates.add(cb.equal(root.get("sport").get("id"), request.getSportId()));
    }
  }

  private static void settingStore(List<Predicate> predicates, SearchRatingRequest request,
                                   Root<Rating> root, CriteriaBuilder cb) {
    if (request.getStoreId() != null) {
      predicates.add(cb.equal(root.get("store").get("id"), request.getSportId()));
    }
  }
}
