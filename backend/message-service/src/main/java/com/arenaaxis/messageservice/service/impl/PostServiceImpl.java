package com.arenaaxis.messageservice.service.impl;

import com.arenaaxis.messageservice.client.service.StoreClientService;
import com.arenaaxis.messageservice.dto.request.ApplyPostRequest;
import com.arenaaxis.messageservice.dto.request.PostCreateRequest;
import com.arenaaxis.messageservice.dto.request.SearchPostRequest;
import com.arenaaxis.messageservice.dto.response.ApplyPostResponse;
import com.arenaaxis.messageservice.dto.response.ApplyResponse;
import com.arenaaxis.messageservice.dto.response.MatchResponse;
import com.arenaaxis.messageservice.dto.response.PostResponse;
import com.arenaaxis.messageservice.dto.response.PostSearchItemResponse;
import com.arenaaxis.messageservice.exception.AppException;
import com.arenaaxis.messageservice.exception.ErrorCode;
import com.arenaaxis.messageservice.mapper.MatchMapper;
import com.arenaaxis.messageservice.mapper.PostMapper;
import com.arenaaxis.messageservice.mapper.StoreMapper;
import com.arenaaxis.messageservice.model.*;
import com.arenaaxis.messageservice.model.enums.Sport;
import com.arenaaxis.messageservice.repository.ApplyPostRepository;
import com.arenaaxis.messageservice.repository.MatchRepository;
import com.arenaaxis.messageservice.repository.ParticipantRepository;
import com.arenaaxis.messageservice.repository.PostRepository;
import com.arenaaxis.messageservice.repository.StoreRepository;
import com.arenaaxis.messageservice.repository.custom.PostRepositoryCustomImpl;
import com.arenaaxis.messageservice.service.MatchService;
import com.arenaaxis.messageservice.service.ParticipantService;
import com.arenaaxis.messageservice.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostServiceImpl implements PostService {
  private final ParticipantRepository participantRepository;
  @NonFinal
  @Value("${match.limit}")
  int limitMatchDays;

  PostRepository postRepository;
  MatchRepository matchRepository;
  StoreRepository storeRepository;
  ApplyPostRepository applyPostRepository;
  PostRepositoryCustomImpl postRepositoryCustom;

  StoreClientService storeClientService;
  ParticipantService participantService;

  MatchService matchService;

  PostMapper postMapper;
  StoreMapper storeMapper;
  MatchMapper matchMapper;

  @Override
  public Mono<PostResponse> createPost(PostCreateRequest request) {
    return findValidMatches(request.getMatchIds())
      .flatMap(this::markMatchesAsPosted)
      .flatMap(matches -> {
          Post post = buildPost(request, matches);
          return postRepository.save(post)
            .flatMap(savedPost -> mapToResponse(savedPost, matches));
      });
  }

  @Override
  public Mono<ApplyResponse> applyPost(ApplyPostRequest request) {
    return Mono.zip(
      participantService.createFromUserId(request.getUserId()),
      postRepository.findById(request.getPostId())
    ).flatMap(tuple -> {
      Participant applier = tuple.getT1();
      Post post = tuple.getT2();

      int nextNumber = post.getCurrentNumber() + request.getNumber();
      if (nextNumber > post.getRequiredNumber() || post.getParticipantIds().contains(request.getUserId())) {
        return Mono.empty();
      }

      post.setCurrentNumber(nextNumber);

      List<String> participantIds = post.getParticipantIds();
      if (participantIds == null) participantIds = new ArrayList<>();
      participantIds.add(request.getUserId());
      post.setParticipantIds(participantIds);

      ApplyPost applyPost = ApplyPost.builder()
        .participantId(applier.getId())
        .postId(post.getId())
        .number(request.getNumber())
        .build();

      return postRepository.save(post)
        .then(applyPostRepository.save(applyPost)
          .flatMap(apply -> mapToApplyResponse(apply, applier, post)));
    });
  }

  @Override
  public Flux<PostSearchItemResponse> searchPost(SearchPostRequest request, int page, int perPage) {
    return postRepositoryCustom.searchPosts(request, page, perPage)
      .flatMapMany(r -> toSearchItemResponses(r.posts()));
  }

  @Override
  public Flux<PostSearchItemResponse> getPostByPoster(String posterId) {
    return postRepository.findByPosterId(posterId)
      .collectList()
      .flatMapMany(this::toSearchItemResponses);
  }

  @Override
  public Mono<PostResponse> updatePost(PostCreateRequest request) {
    return null;
  }

  private Mono<List<Match>> findValidMatches(List<String> matchIds) {
    return matchRepository.findAllByIdsAndTime(
        matchIds,
        LocalDate.now().plusDays(limitMatchDays)
      )
      .collectList()
      .flatMap(matches -> {
        if (matches.size() != matchIds.size()) {
          return Mono.error(new AppException(ErrorCode.MATCH_NOT_FOUND));
        }

        return Mono.just(matches);
      });
  }

  private Mono<List<Match>> markMatchesAsPosted(List<Match> matches) {
    matches.forEach(match -> match.setIsPosted(true));
    return matchRepository.saveAll(matches).collectList();
  }

  private Post buildPost(PostCreateRequest request, List<Match> matches) {
    long totalPrice = calculateTotalPrice(matches);
    long pricePerPerson = calculatePricePerPerson(
      totalPrice,
      request.getRequiredNumber()
    );

    matches.sort(
      Comparator.comparing(Match::getDate)
        .thenComparing(Match::getStartTime)
    );

    Post post = postMapper.fromRequest(request);
    post.setMatchIds(matches.stream().map(Match::getId).toList());
    post.setPosterId(request.getUserId());
    post.setPricePerPerson(pricePerPerson);
    post.setSportId(matches.get(0).getSportId());
    post.setStoreId(matches.get(0).getStoreId());
    post.setMatchDate(LocalDateTime.of(matches.get(0).getDate(), matches.get(0).getStartTime()));

    return post;
  }

  private long calculateTotalPrice(List<Match> matches) {
    return matches.stream()
      .mapToLong(Match::getPrice)
      .sum();
  }

  private long calculatePricePerPerson(long totalPrice, int requiredNumber) {
    return (long) Math.ceil((double) totalPrice / requiredNumber);
  }

  private Mono<PostResponse> mapToResponse(Post post, List<Match> matches) {
    String storeId = matches.get(0).getStoreId();
    return Mono.zip(
        getStore(storeId),
        participantService.createFromUserId(post.getPosterId())
      )
      .map(tuple -> {
        Store store = tuple.getT1();
        Participant poster = tuple.getT2();

        PostResponse response = postMapper.toResponse(post);
        response.setMatches(matches.stream().map(matchMapper::toResponse).toList());
        response.setStore(storeMapper.toResponse(store));
        response.setPoster(poster);
        response.setSport(Objects.requireNonNull(Sport.getById(post.getSportId()))
          .toResponse());

        return response;
      });
  }

  private Mono<ApplyResponse> mapToApplyResponse(
    ApplyPost applyPost,
    Participant applier,
    Post post
  ) {
    return Mono.zip(
      getStore(post.getStoreId()),
      participantService.createFromUserId(post.getPosterId())
    ).map(tuple -> {
      Participant poster = tuple.getT2();
      Store store = tuple.getT1();

      ApplyPostResponse postResponse = ApplyPostResponse.builder()
        .id(post.getId())
        .poster(poster)
        .title(post.getTitle())
        .timestamp(post.getTimestamp())
        .store(storeMapper.toResponse(store))
        .build();

      return ApplyResponse.builder()
        .timestamp(applyPost.getAppliedAt())
        .post(postResponse)
        .applier(applier)
        .number(applyPost.getNumber())
        .build();
    });
  }

  private Flux<PostSearchItemResponse> toSearchItemResponses(List<Post> posts) {
    if (posts == null || posts.isEmpty()) {
      return Flux.empty();
    }

    List<String> userIds = getParticipantIds(posts);
    List<String> storeIds = getStoreIds(posts);
    List<String> matchIds = getMatchIds(posts);

    Mono<Map<String, Participant>> participantMono =
      participantRepository.findAllById(userIds)
        .collectMap(Participant::getId);

    Mono<Map<String, Store>> storeMono =
      storeRepository.findAllById(storeIds)
        .collectMap(Store::getId);

    Mono<Map<String, Match>> matchMono =
      matchRepository.findAllById(matchIds)
        .collectMap(Match::getId);

    return Mono.zip(participantMono, storeMono, matchMono)
      .flatMapMany(tuple -> {
        Map<String, Participant> participantMap = tuple.getT1();
        Map<String, Store> storeMap = tuple.getT2();
        Map<String, Match> matchMap = tuple.getT3();

        return Flux.fromIterable(posts)
          .map(post -> toSearchItemResponse(post, participantMap, storeMap, matchMap));
      });
  }

  private PostSearchItemResponse toSearchItemResponse (
    Post post,
    Map<String, Participant> participantMap,
    Map<String, Store> storeMap,
    Map<String, Match> matchMap
  ) {
    PostSearchItemResponse resp = postMapper.toSearchItemResponse(post);

    resp.setStore(storeMapper.toResponse(storeMap.get(post.getSportId())));
    resp.setSport(Objects.requireNonNull(Sport.getById(post.getSportId())).toResponse());
    resp.setPoster(participantMap.get(post.getPosterId()));
    resp.setParticipants(post.getParticipantIds().stream().map(participantMap::get).toList());

    List<MatchResponse> matches = post.getMatchIds().stream().map(matchMap::get)
      .map(matchService::mapToResponse).toList();

    resp.setMatches(matches);

    return resp;
  }

  private List<String> getParticipantIds(List<Post> posts) {
    return posts.stream()
      .flatMap(post -> {
        Stream<String> posterStream =
          post.getPosterId() == null
            ? Stream.empty()
            : Stream.of(post.getPosterId());

        Stream<String> participantStream =
          post.getParticipantIds() == null
            ? Stream.empty()
            : post.getParticipantIds().stream();

        return Stream.concat(posterStream, participantStream);
      })
      .distinct()
      .toList();
  }

  private List<String> getStoreIds(List<Post> posts) {
    return posts.stream().map(Post::getStoreId).distinct().toList();
  }

  private List<String> getMatchIds(List<Post> posts) {
    return posts.stream()
      .flatMap(post ->
        post.getMatchIds() == null
          ? Stream.empty()
          : post.getMatchIds().stream()
      )
      .distinct()
      .toList();
  }

  private Mono<Store> getStore(String storeId) {
    return storeRepository.findById(storeId)
      .switchIfEmpty(storeClientService.getStoreById(storeId).flatMap(store -> {
        Store storeModel = Store.builder()
          .id(store.getId())
          .name(store.getName())
          .wardId(store.getWard().getId())
          .provinceId(store.getProvince().getId())
          .address(store.getAddress())
          .build();
        return storeRepository.insert(storeModel);
      }));
  }
}
