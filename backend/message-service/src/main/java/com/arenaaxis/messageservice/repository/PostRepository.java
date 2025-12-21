package com.arenaaxis.messageservice.repository;

import com.arenaaxis.messageservice.model.Post;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface PostRepository extends ReactiveMongoRepository<Post, String> {
  Flux<Post> findByPosterId(String posterId);
}
