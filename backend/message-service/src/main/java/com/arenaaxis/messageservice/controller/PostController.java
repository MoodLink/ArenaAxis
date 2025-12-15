package com.arenaaxis.messageservice.controller;

import com.arenaaxis.messageservice.dto.request.PostCreateRequest;
import com.arenaaxis.messageservice.dto.response.MatchResponse;
import com.arenaaxis.messageservice.dto.response.PostResponse;
import com.arenaaxis.messageservice.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {
  PostService postService;

  @PostMapping
  public Mono<ResponseEntity<PostResponse>> createPost(@RequestBody PostCreateRequest request) {
    return postService.createPost(request).map(ResponseEntity::ok);
  }

  @PostMapping("/{postId}/apply")
  public Mono<ResponseEntity<PostResponse>> applyPost(@PathVariable("postId") String postId) {
    return null;
  }
}
