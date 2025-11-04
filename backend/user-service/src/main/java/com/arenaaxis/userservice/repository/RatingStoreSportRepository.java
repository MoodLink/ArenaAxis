package com.arenaaxis.userservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.arenaaxis.userservice.entity.RatingStoreSport;

@Repository
public interface RatingStoreSportRepository extends JpaRepository<RatingStoreSport, String> {
  List<RatingStoreSport> findByStoreId(String storeId);
}
