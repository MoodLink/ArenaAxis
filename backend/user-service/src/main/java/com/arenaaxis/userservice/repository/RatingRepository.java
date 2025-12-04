package com.arenaaxis.userservice.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.arenaaxis.userservice.entity.Rating;

@Repository
public interface RatingRepository extends JpaRepository<Rating, String>, JpaSpecificationExecutor<Rating> {
    @Query("SELECT r FROM Rating r LEFT JOIN FETCH r.ratingMedias WHERE r.store.id = :storeId")
    List<Rating> findByStoreId(@Param("storeId") String storeId, Pageable pageable);
}
