package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.request.NearbyRequest;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.mapper.StoreMapper;
import com.arenaaxis.userservice.repository.StoreRepository;
import com.arenaaxis.userservice.service.RecommendService;
import com.arenaaxis.userservice.specification.StoreSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RecommendServiceImpl implements RecommendService {
  StoreRepository storeRepository;
  StoreMapper storeMapper;

  @NonFinal
  @Value("${recommend.near_by.limit}")
  protected int nearByLimit;

  @Override
  public List<StoreSearchItemResponse> nearByRecommend(NearbyRequest request) {
    Pageable pageable = PageRequest.of(0, nearByLimit, Sort.by(Sort.Direction.DESC, "averageRating"));
    Specification<Store> spec = StoreSpecification.recommendStores(request);
    Page<Store> stores = storeRepository.findAll(spec, pageable);
    return stores.stream().map(storeMapper::toStoreSearchItemResponse).toList();
  }
}
