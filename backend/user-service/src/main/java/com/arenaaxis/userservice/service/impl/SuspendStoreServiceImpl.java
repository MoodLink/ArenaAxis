package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.client.dto.request.OrdersByStoreRequest;
import com.arenaaxis.userservice.client.dto.response.OrderClientResponse;
import com.arenaaxis.userservice.client.service.OrderClientService;
import com.arenaaxis.userservice.dto.request.SearchSuspendStoreRequest;
import com.arenaaxis.userservice.dto.request.SuspendStoreRequest;
import com.arenaaxis.userservice.dto.response.RemainingOrderResponse;
import com.arenaaxis.userservice.dto.response.StoreSearchItemResponse;
import com.arenaaxis.userservice.dto.response.SuspendStoreResponse;
import com.arenaaxis.userservice.dto.response.UserResponse;
import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.entity.SuspendStore;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.exception.special.DuplicateSuspendException;
import com.arenaaxis.userservice.exception.special.RemainingOrderException;
import com.arenaaxis.userservice.mapper.OrderMapper;
import com.arenaaxis.userservice.mapper.StoreMapper;
import com.arenaaxis.userservice.mapper.SuspendStoreMapper;
import com.arenaaxis.userservice.mapper.UserMapper;
import com.arenaaxis.userservice.repository.StoreRepository;
import com.arenaaxis.userservice.repository.SuspendStoreRepository;
import com.arenaaxis.userservice.repository.UserRepository;
import com.arenaaxis.userservice.service.SuspendStoreService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SuspendStoreServiceImpl implements SuspendStoreService {
  OrderClientService orderClientService;

  SuspendStoreRepository suspendStoreRepository;
  StoreRepository storeRepository;
  UserRepository userRepository;

  SuspendStoreMapper suspendStoreMapper;
  OrderMapper orderMapper;
  StoreMapper storeMapper;
  UserMapper userMapper;

  @Override
  @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
  public SuspendStoreResponse suspendStore(SuspendStoreRequest request, User current) {
    Store store = validateAndGetStore(request, current);

    SuspendStore suspendStore = suspendStoreMapper.fromRequest(request);
    suspendStore.setStore(store);
    suspendStore.setOperator(current);
    suspendStore = suspendStoreRepository.save(suspendStore);

    return suspendStoreMapper.toResponse(suspendStore);
  }

  @Override
  @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
  public SuspendStoreResponse updateSuspend(String suspendId, SuspendStoreRequest request, User current) {
    SuspendStore suspendStore = suspendStoreRepository.findById(suspendId)
      .orElseThrow(() -> new AppException(ErrorCode.SUSPEND_STORE_NOT_EXISTS));
    validateAndGetStore(request, current);
    suspendStoreMapper.fromRequest(suspendStore, request);
    suspendStore = suspendStoreRepository.save(suspendStore);
    return suspendStoreMapper.toResponse(suspendStore);
  }

  @Override
  public List<SuspendStoreResponse> getAllSuspendStores(SearchSuspendStoreRequest request, User current) {
    Store store = storeRepository.findById(request.getStoreId())
      .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
    validatePermission(current, store);

    return suspendStoreRepository.findSuspendStore(request.getStoreId(), request.getFrom(), request.getTo())
      .stream().map(suspendStoreMapper::toResponse).toList();
  }

  @Override
  public Boolean checkSuspend(String storeId, LocalDate date) {
    return suspendStoreRepository.existsByStore_IdAndTime(storeId, date);
  }

  private Store validateAndGetStore(SuspendStoreRequest request, User current) {
    Store store = storeRepository.findById(request.getStoreId())
      .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

    validatePermission(current, store);
    checkDuplicateSuspends(request.getStoreId(), request.getStartAt(), request.getEndAt());

    if (!Boolean.TRUE.equals(request.getForce())) {
      checkIfHasAnyOrder(store, request.getStartAt(), request.getEndAt());
    }

    return store;
  }

  private void validatePermission(User current, Store store) {
    boolean isAdmin = current.getRole().isAdmin();
    boolean isOwner = store.getOwner().getId().equals(current.getId());

    if (!isAdmin && !isOwner) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }
  }

  private void checkDuplicateSuspends(String storeId, LocalDate start, LocalDate end) {
    List<SuspendStore> duplicateSuspends = suspendStoreRepository.findSuspendStore(storeId, start, end);

    if (!duplicateSuspends.isEmpty()) {
      throw new DuplicateSuspendException(duplicateSuspends.stream()
        .map(suspendStoreMapper::toResponse).toList());
    }
  }

  private void checkIfHasAnyOrder(Store store, LocalDate start, LocalDate end) {
    OrdersByStoreRequest request = OrdersByStoreRequest.builder()
      .storeId(store.getId())
      .startTime(start)
      .endTime(end)
      .build();

    List<OrderClientResponse> orders = orderClientService.getByStoreId(request);
    if (orders.isEmpty()) return;

    throw new RemainingOrderException(mapOrderToResponse(orders, store));
  }

  private List<RemainingOrderResponse> mapOrderToResponse(List<OrderClientResponse> orders, Store store) {
    List<String> userIds = orders.stream().map(OrderClientResponse::getUserId).distinct().toList();

    Map<String, UserResponse> usersMap = userRepository.findAllById(userIds)
      .stream()
      .collect(Collectors.toMap(
        User::getId,
        userMapper::toUserResponse,
        (u1, u2) -> u1)
      );

    StoreSearchItemResponse storeResponse = storeMapper.toStoreSearchItemResponse(store);

    return orders.stream().map(order -> {
      RemainingOrderResponse response = orderMapper.toRemainingOrderResponse(order);
      response.setUser(usersMap.get(order.getUserId()));
      response.setStore(storeResponse);
      return response;
    }).toList();
  }
}
