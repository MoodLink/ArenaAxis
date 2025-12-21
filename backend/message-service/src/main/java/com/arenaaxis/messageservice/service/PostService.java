package com.arenaaxis.messageservice.service;

import com.arenaaxis.messageservice.dto.request.ApplyPostRequest;
import com.arenaaxis.messageservice.dto.request.PostCreateRequest;
import com.arenaaxis.messageservice.dto.request.SearchPostRequest;
import com.arenaaxis.messageservice.dto.response.ApplyResponse;
import com.arenaaxis.messageservice.dto.response.PostResponse;
import com.arenaaxis.messageservice.dto.response.PostSearchItemResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface PostService {
  Mono<PostResponse> createPost(PostCreateRequest request);
  Mono<ApplyResponse> applyPost(ApplyPostRequest request);
  Flux<PostSearchItemResponse> searchPost(SearchPostRequest request, int page, int perPage);
  Flux<PostSearchItemResponse> getPostByPoster(String posterId);
  Mono<PostResponse> updatePost(PostCreateRequest request);
}
