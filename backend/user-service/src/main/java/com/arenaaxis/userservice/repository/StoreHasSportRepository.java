package com.arenaaxis.userservice.repository;

import com.arenaaxis.userservice.entity.StoreHasSport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoreHasSportRepository extends JpaRepository<StoreHasSport, String> {
  Optional<StoreHasSport> findBySportIdAndStoreId(String sportId, String storeId);
}
