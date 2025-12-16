package com.arenaaxis.messageservice.service;

import com.arenaaxis.messageservice.dto.response.MatchResponse;
import reactor.core.publisher.Flux;

public interface MatchService {
  Flux<MatchResponse> getMatches(String orderId);
}
