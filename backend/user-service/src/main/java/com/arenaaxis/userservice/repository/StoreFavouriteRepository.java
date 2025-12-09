package com.arenaaxis.userservice.repository;

import com.arenaaxis.userservice.entity.StoreFavourite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreFavouriteRepository extends JpaRepository<StoreFavourite, String> {
  @Modifying(clearAutomatically = true)
  boolean existsByStoreIdAndUserId(String storeId, String userId);

  List<StoreFavourite> findByUserId(String userId);

  @Modifying
  void deleteByUserId(String userId);

  @Modifying
  @Query("DELETE FROM StoreFavourite s WHERE s.store.id = :storeId AND s.user.id = :userId")
  void deleteByStoreIdAndUserId(String storeId, String userId);

  @Modifying
  @Query("DELETE FROM StoreFavourite s WHERE s.store.id IN :storeIds AND s.user.id = :userId")
  void deleteByStoreIdsAndUserId(List<String> storeIds, String userId);
}
