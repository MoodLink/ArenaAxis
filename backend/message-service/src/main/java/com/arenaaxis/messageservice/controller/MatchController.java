package com.arenaaxis.messageservice.controller;

import com.arenaaxis.messageservice.dto.response.MatchResponse;
import com.arenaaxis.messageservice.service.MatchService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MatchController {
  MatchService matchService;

  @GetMapping("/order/{orderId}")
  public Mono<ResponseEntity<List<MatchResponse>>> getMatches(
    @PathVariable("orderId") String orderId) {
    return matchService.getMatches(orderId)
      .collectList()
      .map(ResponseEntity::ok);
  }
}
