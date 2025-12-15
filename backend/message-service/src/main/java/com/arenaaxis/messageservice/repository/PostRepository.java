package com.arenaaxis.messageservice.repository;

import com.arenaaxis.messageservice.model.Post;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface PostRepository extends ReactiveMongoRepository<Post, String> {
}
