package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.entity.StoreViewHistory;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.mapper.StoreMapper;
import com.arenaaxis.userservice.repository.StoreViewHistoryRepository;
import com.arenaaxis.userservice.service.StoreViewHistoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreViewHistoryServiceImpl implements StoreViewHistoryService {
  StoreViewHistoryRepository storeViewHistoryRepository;
  StoreMapper storeMapper;

  @Override
  public List<StoreSearchItemResponse> getByUserId(User currentUser) {
    List<StoreViewHistory> histories = storeViewHistoryRepository.findByUserId(currentUser.getId());
    return histories.stream()
                    .map(StoreViewHistory::getStore)
                    .map(storeMapper::toStoreSearchItemResponse)
                    .toList();
  }

  @Override
  public void deleteByStoreIdAndUserId(String storeId, User currentUser) {
    storeViewHistoryRepository.deleteByStoreIdAndUserId(storeId, currentUser.getId());
  }

  @Override
  public void deleteAllByUserId(User currentUser) {
    storeViewHistoryRepository.deleteByUserId(currentUser.getId());
  }

  @Override
  public void deleteByStoreIdsAndUser(List<String> ids, User currentUser) {
    storeViewHistoryRepository.deleteByStoreIdsAndUserId(ids, currentUser.getId());
  }
}
