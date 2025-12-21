package com.arenaaxis.userservice.specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import com.arenaaxis.userservice.dto.request.SearchUserRequest;
import com.arenaaxis.userservice.entity.User;

public class UserSpecification {
  private UserSpecification() {}

  public static Specification<User> search(SearchUserRequest request) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();
      // settingSport(predicates, request, root, cb);
      // settingStore(predicates, request, root, cb);

      Objects.requireNonNull(query).distinct(true);
      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }
}
