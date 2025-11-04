package com.arenaaxis.userservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.arenaaxis.userservice.entity.Rating;

@Repository
public interface RatingRepository extends JpaRepository<Rating, String>, JpaSpecificationExecutor<Rating> {

}
