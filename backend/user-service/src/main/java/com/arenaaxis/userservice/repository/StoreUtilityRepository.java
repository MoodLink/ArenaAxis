package com.arenaaxis.userservice.repository;

import com.arenaaxis.userservice.entity.StoreUtility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreUtilityRepository extends JpaRepository<StoreUtility, String> {
}
