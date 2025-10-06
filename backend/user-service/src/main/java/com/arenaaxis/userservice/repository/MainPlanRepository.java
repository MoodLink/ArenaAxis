package com.arenaaxis.userservice.repository;

import com.arenaaxis.userservice.entity.MainPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MainPlanRepository extends JpaRepository<MainPlan, String> {
}
