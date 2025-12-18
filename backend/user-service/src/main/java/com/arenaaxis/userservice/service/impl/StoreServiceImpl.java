package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.client.service.OrderClientService;
import com.arenaaxis.userservice.dto.request.SearchStoreAdminRequest;
import com.arenaaxis.userservice.dto.request.SearchStoreRequest;
import com.arenaaxis.userservice.dto.request.StoreCreateRequest;
import com.arenaaxis.userservice.dto.request.StoreUpdateRequest;
import com.arenaaxis.userservice.dto.response.StoreAdminDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreAdminSearchItemResponse;
import com.arenaaxis.userservice.dto.response.StoreClientDetailResponse;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.entity.*;
import com.arenaaxis.userservice.entity.enums.Role;
import com.arenaaxis.userservice.entity.enums.StoreImageType;
import com.arenaaxis.userservice.entity.enums.UtilityType;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.mapper.SportMapper;
import com.arenaaxis.userservice.mapper.StoreMapper;
import com.arenaaxis.userservice.mapper.WardRepository;
import com.arenaaxis.userservice.repository.RatingRepository;
import com.arenaaxis.userservice.repository.RatingStoreSportRepository;
import com.arenaaxis.userservice.repository.StoreRepository;
import com.arenaaxis.userservice.repository.StoreViewHistoryRepository;
import com.arenaaxis.userservice.service.*;
import com.arenaaxis.userservice.service.event.StoreApprovedEvent;
import com.arenaaxis.userservice.service.helper.RatingSummary;
import com.arenaaxis.userservice.specification.StoreSpecification;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class StoreServiceImpl implements StoreService {
  ApplicationEventPublisher eventPublisher;

  StoreRepository storeRepository;
  WardRepository wardRepository;
  RatingStoreSportRepository ratingStoreSportRepository;
  StoreViewHistoryRepository storeViewHistoryRepository;

  StoreHasSportService storeHasSportService;
  RatingStoreSportService ratingStoreSportService;
  StoreUtilityService storeUtilityService;

  StoreMapper storeMapper;
  MediaService mediaService;
  AuthenticationService authenticationService;
  SportMapper sportMapper;

  OrderClientService orderClientService;

  @Override
  @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_CLIENT')")
  public StoreAdminDetailResponse create(StoreCreateRequest request, User owner)
      throws ParseException, JOSEException {
    Ward ward = getWard(request.getWardId());
    Store store = storeMapper.fromCreateRequest(request);
    String newToken = authenticationService.buildTokenWhenUpgradeUser(owner);

    store.setOwner(owner);
    store.setWard(ward);
    store.setProvince(ward.getProvince());
    setCoordinateIfPresent(store, request.getLinkGoogleMap());

    store = storeRepository.save(store);
    addUtilities(store, request.getUtilities());

    return storeMapper.toAdminDetailResponse(store, newToken);
  }

  @Override
  @PreAuthorize("hasRole('ROLE_CLIENT')")
  @PostAuthorize("returnObject.owner.email == authentication.name")
  public StoreAdminDetailResponse updateImage(String storeId, Map<StoreImageType, List<MultipartFile>> images) {
    Store store = storeRepository.findById(storeId)
        .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

    images.forEach((type, files) -> {
      if (files == null)
        return;

      if (type == StoreImageType.MEDIAS) {
        mediaService.uploadMultipleMedias(store, files);
      } else {
        MultipartFile file = files.get(0);
        mediaService.uploadImagesStore(store, type, file);
      }
    });

    return storeMapper.toAdminDetailResponse(store);
  }

  @Override
  @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
  public StoreAdminDetailResponse update(String id, StoreUpdateRequest request, User owner) {
    Store store = storeRepository.findById(id)
      .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

    if (owner.getRole() != Role.ADMIN || !owner.getId().equals(store.getOwner().getId())) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }
    return null;
  }

  @Override
  @Transactional
  public StoreClientDetailResponse detail(String storeId, User currentUser) {
    Store store = storeRepository.findById(storeId)
        .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

    if (shouldIncreaseView(currentUser)) {
      store.increaseViewCount();
      store = storeRepository.save(store);
    }

    if (shouldSaveHistory(currentUser, storeId)) {
      saveStoreViewHistory(store, currentUser);
    }

    var response = storeMapper.toClientDetailResponse(store);
    List<Sport> sports = storeHasSportService.getSportByStoreId(storeId);
    response.setSports(sports.stream().map(sportMapper::toResponse).toList());
    response.setSportRatings(ratingStoreSportService.sportRatingsOfStore(store.getId()));

    return response;
  }

  @Override
  public StoreAdminDetailResponse toggleActiveStatus(String storeId) {
    return null;
  }

  @Override
  public List<StoreSearchItemResponse> getInPagination(int page, int perPage) {
    Pageable pageable = PageRequest.of(page - 1, perPage);
    Page<Store> storePage = storeRepository.findAll(pageable);

    return storePage.getContent().stream()
        .map(storeMapper::toStoreSearchItemResponse)
        .toList();
  }

  @Override
  public List<StoreSearchItemResponse> searchInPagination(
    SearchStoreRequest request, int page, int perPage
  ) {
    Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(Sort.Direction.DESC, "createdAt"));
    Specification<Store> spec = StoreSpecification.searchStores(request);
    Page<Store> storePage = storeRepository.findAll(spec, pageable);
    return storePage.getContent().stream()
      .map(storeMapper::toStoreSearchItemResponse).toList();
  }

  @Override
  public List<StoreAdminDetailResponse> getStoresByOwnerId(String ownerId, User currentUser) {
    if (!currentUser.getId().equals(ownerId) && !currentUser.getRole().isAdmin()) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    return storeRepository.findByOwner_Id(ownerId)
        .stream()
        .map(storeMapper::toAdminDetailResponse)
        .toList();
  }

  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public List<StoreAdminSearchItemResponse> adminSearch(SearchStoreAdminRequest request, int page, int perPage) {
    Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(Sort.Direction.DESC, "createdAt"));
    Specification<Store> spec = StoreSpecification.adminSearchStores(request);
    Page<Store> storePage = storeRepository.findAll(spec, pageable);

    return toAdminSearchResponse(storePage.getContent());
  }

  @Override
  @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
  public StoreAdminDetailResponse suspendStore(String storeId, User currentUser) {
    Store store = getStore(storeId, currentUser);

    return null;
  }

  @Override
  public void increaseOrderCount(String storeId) {
    Store store = storeRepository.findById(storeId)
      .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

    store.increaseOrderCount();
    storeRepository.save(store);
  }

  @Override
  @Transactional
  @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CLIENT')")
  public StoreAdminDetailResponse fullInfo(String storeId) {
    Store store = storeRepository.findById(storeId)
        .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
    return storeMapper.toAdminDetailResponse(store);
  }

  @Override
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public StoreAdminDetailResponse approveStore(String storeId, User currentUser) {
    Store store = getStore(storeId, currentUser);
    if (!store.isApprovable()) {
      throw new AppException(ErrorCode.STORE_CANNOT_BE_APPROVED);
    }

    store.setApproved(true);
    store.setApprovedAt(LocalDateTime.now());
    store = storeRepository.save(store);

    eventPublisher.publishEvent(new StoreApprovedEvent(this, store));
    return storeMapper.toAdminDetailResponse(store, null);
  }

  private Store getStore(String storeId, User user) {
    Store store = storeRepository.findById(storeId)
      .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

    if (user.getRole() != Role.ADMIN && !user.getId().equals(store.getOwner().getId())) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    return store;
  }

  private void setCoordinateIfPresent(Store store, String link) {
    if (link == null || link.isBlank()) return;

    List<BigDecimal> coors = extractLocationFromLink(link);
    if (coors.size() != 2) return;

    store.setLatitude(coors.get(0));
    store.setLongitude(coors.get(1));
  }

  private void addUtilities(Store store, List<UtilityType> types) {
    if (types == null) return;

    List<StoreUtility> storeUtilities = storeUtilityService.createUtilitiesForStore(store, types);
    store.setUtilities(Set.of(storeUtilities.toArray(new StoreUtility[0])));
  }

  private Ward getWard(String wardId) {
    return wardRepository.findById(wardId)
        .orElseThrow(() -> new AppException(ErrorCode.WARD_NOT_FOUND));
  }

  private boolean shouldIncreaseView(User currentUser) {
    return currentUser == null || currentUser.getRole() == Role.USER;
  }

  private boolean shouldSaveHistory(User currentUser, String storeId) {

    if (currentUser == null) return false;
    if (currentUser.getRole() != Role.USER) return false;


    return !storeViewHistoryRepository.existsByStoreIdAndUserId(storeId, currentUser.getId());
  }

  private void saveStoreViewHistory(Store store, User currentUser) {
    StoreViewHistory storeViewHistory = StoreViewHistory.builder()
        .user(currentUser)
        .store(store)
        .build();
    storeViewHistoryRepository.save(storeViewHistory);
  }

  private List<BigDecimal> extractLocationFromLink(String linkGoogleMap) {
    List<BigDecimal> coordinates = new ArrayList<>();
    try {
      int atIndex = linkGoogleMap.indexOf('@');
      if (atIndex != -1) {
        String substring = linkGoogleMap.substring(atIndex + 1);
        String[] parts = substring.split(",");
        if (parts.length >= 2) {
          BigDecimal lat = BigDecimal.valueOf(Float.parseFloat(parts[0]));
          BigDecimal lng = BigDecimal.valueOf(Float.parseFloat(parts[1]));
          coordinates.add(lat);
          coordinates.add(lng);
        }
      }
    } catch (Exception e) {
      log.info("Invalid Google Maps link: {}", e.getMessage());
    }
    return coordinates;
  }

  private List<StoreAdminSearchItemResponse> toAdminSearchResponse(List<Store> stores) {
    if (stores.isEmpty()) return List.of();

    List<String> ids = stores.stream().map(Store::getId).toList();
    List<Object[]> ratingRows = ratingStoreSportRepository.findRatingSummary(ids);

    Map<String, RatingSummary> ratingMap = new HashMap<>();
    for (Object[] row : ratingRows) {
      String storeId = (String) row[0];
      Long ratingCount = (Long) row[1];

      ratingMap.put(storeId, new RatingSummary(ratingCount));
    }

    return stores.stream()
      .map(store -> {
        StoreAdminSearchItemResponse res =
          storeMapper.toStoreAdminSearchItemResponse(store);

        RatingSummary summary = ratingMap.get(store.getId());
        if (summary != null) {
          res.setRatingCount(summary.ragingCount().intValue());
        } else {
          res.setRatingCount(0);
        }
        return res;
      })
      .toList();
  }
}
