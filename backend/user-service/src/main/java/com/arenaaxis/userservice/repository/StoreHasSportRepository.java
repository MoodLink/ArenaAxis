package com.arenaaxis.userservice.repository;

import com.arenaaxis.userservice.entity.Sport;
import com.arenaaxis.userservice.entity.StoreHasSport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreHasSportRepository extends JpaRepository<StoreHasSport, String> {
  Optional<StoreHasSport> findBySportIdAndStoreId(String sportId, String storeId);
  boolean existsBySportIdAndStoreId(String sportId, String storeId);

  @Query("SELECT s.sport FROM StoreHasSport s WHERE s.hasSport = true AND s.store.id = :storeId")
  List<Sport> getSportsByStoreId(String storeId);
}
