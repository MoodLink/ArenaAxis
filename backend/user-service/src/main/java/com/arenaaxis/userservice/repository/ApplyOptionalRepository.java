package com.arenaaxis.userservice.repository;

import com.arenaaxis.userservice.entity.ApplyOptionalPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplyOptionalRepository extends JpaRepository<ApplyOptionalPlan, String> {
}
