package com.arenaaxis.messageservice.repository;

import com.arenaaxis.messageservice.model.Match;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.List;

public interface MatchRepository extends ReactiveMongoRepository<Match, String> {
  Mono<Boolean> existsByOrderId(String orderId);

  @Query("""
    {
      orderId: ?0,
      isPosted: false,
      date: { $gte: ?1 }
    }
  """)
  Flux<Match> findValidMatches(String orderId, LocalDate date);

  @Query("""
    {
      id: { $in: ?0 },
      isPosted: false
    }
  """)
  Flux<Match> findAllByIdsAndTime(List<String> ids, LocalDate date);
}
