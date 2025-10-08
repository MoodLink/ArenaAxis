package com.arenaaxis.userservice.repository;

import com.arenaaxis.userservice.entity.OptionalPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionalRepository extends JpaRepository<OptionalPlan, String> {
}
