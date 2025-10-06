package com.arenaaxis.userservice.repository;

import com.arenaaxis.userservice.entity.Sport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SportRepository extends JpaRepository<Sport, String> {
}
