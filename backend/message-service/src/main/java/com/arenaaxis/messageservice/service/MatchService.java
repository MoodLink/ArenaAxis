package com.arenaaxis.messageservice.service;

import com.arenaaxis.messageservice.dto.response.MatchResponse;
import com.arenaaxis.messageservice.model.Match;
import reactor.core.publisher.Flux;

public interface MatchService {
  Flux<MatchResponse> getMatches(String orderId);
  MatchResponse mapToResponse(Match match);
}
