package com.arenaaxis.userservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.arenaaxis.userservice.entity.RatingStoreSport;

@Repository
public interface RatingStoreSportRepository extends JpaRepository<RatingStoreSport, String> {
  List<RatingStoreSport> findByStoreId(String storeId);

  @Query("""
    SELECT r.store.id, SUM(r.ratingCount), SUM(r.ratingScore)
    FROM RatingStoreSport r
    WHERE r.store.id IN :storeIds
    GROUP BY r.store.id
  """)
  List<Object[]> findRatingSummary(@Param("storeIds") List<String> storeIds);
}
