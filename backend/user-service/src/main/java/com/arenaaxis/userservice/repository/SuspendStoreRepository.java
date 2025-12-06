package com.arenaaxis.userservice.repository;

import com.arenaaxis.userservice.entity.SuspendStore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SuspendStoreRepository extends JpaRepository<SuspendStore, String> {
  List<SuspendStore> findByStore_IdOrderByStartAtAsc(String storeId);

  @Query(
    "SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END " +
    "FROM SuspendStore s " +
    "WHERE s.store.id = :storeId " +
    "AND s.startAt <= :time " +
    "AND s.endAt >= :time"
  )
  boolean existsByStore_IdAndTime(String storeId, LocalDateTime time);

  @Query("""
      SELECT s
      FROM SuspendStore s
      WHERE s.store.id = :storeId
        AND (
              (:end IS NULL AND s.endAt IS NULL)
           OR (:end IS NULL AND s.startAt <= CURRENT_TIMESTAMP)
           OR (s.startAt <= :end)
        )
        AND (s.endAt IS NULL OR s.endAt >= :start)
      ORDER BY s.startAt ASC
  """)
  List<SuspendStore> findSuspendStore(
    @Param("storeId") String storeId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end
  );

  default boolean isStoreSuspendedNow(String storeId) {
    return existsByStore_IdAndTime(storeId, LocalDateTime.now());
  }
}
