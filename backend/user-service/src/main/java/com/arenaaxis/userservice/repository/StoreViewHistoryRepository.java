package com.arenaaxis.userservice.repository;

import com.arenaaxis.userservice.entity.StoreViewHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface StoreViewHistoryRepository extends JpaRepository<StoreViewHistory, String> {
  List<StoreViewHistory> findByUserId(String userId);
  boolean existsByStoreIdAndUserId(String storeId, String userId);
  void deleteByUserId(String userId);
  void deleteByStoreIdAndUserId(String storeId, String userId);

  @Transactional
  @Modifying
  @Query("DELETE FROM StoreViewHistory s WHERE s.store.id IN :storeIds AND s.user.id = :userId")
  void deleteByStoreIdsAndUserId(@Param("storeIds") List<String> storeIds,
                                 @Param("userId") String userId);
}
