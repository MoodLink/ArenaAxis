package com.arenaaxis.messageservice.repository.custom;

import com.arenaaxis.messageservice.dto.request.SearchPostRequest;
import com.arenaaxis.messageservice.model.Post;
import com.arenaaxis.messageservice.model.Store;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Repository
@RequiredArgsConstructor
public class PostRepositoryCustomImpl {

  private final ReactiveMongoTemplate reactiveMongoTemplate;

  public Mono<PostSearchResult> searchPosts(SearchPostRequest request, int page, int size) {
    Pageable pageable = PageRequest.of(page, size,
      Sort.by("matchDate").ascending()
        .and(Sort.by("matchStartTime").ascending())
    );

    return buildQuery(request)
      .flatMap(query -> {
        Mono<Long> totalMono = reactiveMongoTemplate.count(query, Post.class);
        query.with(pageable);
        Flux<Post> postsFlux = reactiveMongoTemplate.find(query, Post.class);

        return Mono.zip(
          postsFlux.collectList(),
          totalMono
        ).map(tuple -> new PostSearchResult(
          tuple.getT1(),
          tuple.getT2(),
          page,
          size
        ));
      });
  }

  private Mono<Query> buildQuery(SearchPostRequest request) {
    Query query = new Query();
    List<Criteria> criteriaList = new ArrayList<>();

    if (request == null) {
      addDefaultFilters(criteriaList, null, null);
      if (!criteriaList.isEmpty()) {
        query.addCriteria(new Criteria().andOperator(
          criteriaList.toArray(new Criteria[0])
        ));
      }
      return Mono.just(query);
    }

    addDefaultFilters(criteriaList, request.getFromDate(), request.getToDate());
    filterSportId(criteriaList, request.getSportId());

    Mono<List<Criteria>> storeCriteriaMono = handleStoreFilters(request);
    return storeCriteriaMono.map(storeCriteria -> {
      criteriaList.addAll(storeCriteria);

      if (!criteriaList.isEmpty()) {
        query.addCriteria(new Criteria().andOperator(
          criteriaList.toArray(new Criteria[0])
        ));
      }

      return query;
    });
  }

  private Mono<List<Criteria>> handleStoreFilters(SearchPostRequest request) {
    List<Mono<Criteria>> storeCriteriaMonos = new ArrayList<>();

    if (request.getStoreName() != null && !request.getStoreName().isEmpty()) {
      Mono<Criteria> storeNameCriteria = findStoreIdsByName(request.getStoreName())
        .collectList()
        .map(storeIds -> {
          if (storeIds.isEmpty()) {
            return Criteria.where("storeId").is(null);
          }
          return Criteria.where("storeId").in(storeIds);
        });
      storeCriteriaMonos.add(storeNameCriteria);
    }

    if ((request.getWardId() != null && !request.getWardId().isEmpty()) ||
      (request.getProvinceId() != null && !request.getProvinceId().isEmpty())) {

      Mono<Criteria> locationCriteria = findStoreIdsByLocation(
        request.getWardId(),
        request.getProvinceId()
      ).collectList()
        .map(storeIds -> {
          if (storeIds.isEmpty()) {
            return Criteria.where("storeId").is(null);
          }
          return Criteria.where("storeId").in(storeIds);
        });
      storeCriteriaMonos.add(locationCriteria);
    }

    if (storeCriteriaMonos.isEmpty()) {
      return Mono.just(new ArrayList<>());
    }

    return Flux.merge(storeCriteriaMonos)
      .collectList();
  }

  private Flux<String> findStoreIdsByName(String storeName) {
    Query storeQuery = new Query();
    storeQuery.addCriteria(
      Criteria.where("name").regex(storeName, "i")
    );

    return reactiveMongoTemplate.find(storeQuery, Store.class)
      .map(Store::getId);
  }

  private Flux<String> findStoreIdsByLocation(String wardId, String provinceId) {
    Query storeQuery = new Query();
    List<Criteria> storeCriteriaList = new ArrayList<>();

    if (wardId != null && !wardId.isEmpty()) {
      storeCriteriaList.add(Criteria.where("wardId").is(wardId));
    }

    if (provinceId != null && !provinceId.isEmpty()) {
      storeCriteriaList.add(Criteria.where("provinceId").is(provinceId));
    }

    if (!storeCriteriaList.isEmpty()) {
      storeQuery.addCriteria(new Criteria().andOperator(
        storeCriteriaList.toArray(new Criteria[0])
      ));
    }

    return reactiveMongoTemplate.find(storeQuery, Store.class)
      .map(Store::getId);
  }

  private void addDefaultFilters(List<Criteria> criteriaList, LocalDate fromDate, LocalDate toDate) {
    criteriaList.add(Criteria.where("active").is(true));

    criteriaList.add(Criteria.where("matchDate").gte(Objects.requireNonNullElseGet(fromDate, LocalDate::now)));

    if (toDate != null) {
      criteriaList.add(Criteria.where("matchDate").lte(LocalDateTime.of(toDate, LocalTime.MAX)));
    }
  }

  private void filterSportId(List<Criteria> criteriaList, String sportId) {
    if (sportId == null || sportId.isEmpty()) return;
    criteriaList.add(Criteria.where("sportId").is(sportId));
  }

  public record PostSearchResult(List<Post> posts, long total, int page, int size) {

    public int getTotalPages() {
      return (int) Math.ceil((double) total / size);
    }

    public boolean hasNext() {
      return page < getTotalPages() - 1;
    }

    public boolean hasPrevious() {
      return page > 0;
    }
  }
}