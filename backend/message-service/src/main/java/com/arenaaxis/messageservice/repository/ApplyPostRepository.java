package com.arenaaxis.messageservice.repository;

import com.arenaaxis.messageservice.model.ApplyPost;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface ApplyPostRepository extends ReactiveMongoRepository<ApplyPost, String> {
}
