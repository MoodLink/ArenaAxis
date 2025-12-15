package com.arenaaxis.messageservice.service;

import com.arenaaxis.messageservice.dto.request.ApplyPostRequest;
import com.arenaaxis.messageservice.dto.request.PostCreateRequest;
import com.arenaaxis.messageservice.dto.request.SearchPostRequest;
import com.arenaaxis.messageservice.dto.response.MatchResponse;
import com.arenaaxis.messageservice.dto.response.PostResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface PostService {
  Mono<PostResponse> createPost(PostCreateRequest request);
  Mono<PostResponse> applyPost(ApplyPostRequest request);
  Flux<PostResponse> searchPost(SearchPostRequest request, int page, int perPage);
  Mono<PostResponse> updatePost(PostCreateRequest request);
}
