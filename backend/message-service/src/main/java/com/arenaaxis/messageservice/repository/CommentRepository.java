package com.arenaaxis.messageservice.repository;

import com.arenaaxis.messageservice.model.Comment;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface CommentRepository extends ReactiveMongoRepository<Comment, String> {
}
