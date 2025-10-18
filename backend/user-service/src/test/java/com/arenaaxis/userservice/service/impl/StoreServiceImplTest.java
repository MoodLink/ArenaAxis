package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.request.StoreCreateRequest;
import com.arenaaxis.userservice.dto.response.StoreAdminDetailResponse;
import com.arenaaxis.userservice.entity.Province;
import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.entity.User;
import com.arenaaxis.userservice.entity.Ward;
import com.arenaaxis.userservice.entity.enums.Role;
import com.arenaaxis.userservice.mapper.StoreMapper;
import com.arenaaxis.userservice.mapper.WardRepository;
import com.arenaaxis.userservice.repository.StoreRepository;
import com.arenaaxis.userservice.repository.StoreViewHistoryRepository;
import com.arenaaxis.userservice.service.AuthenticationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StoreServiceImplTest {
  @Mock
  StoreRepository storeRepository;
  @Mock
  WardRepository wardRepository;
  @Mock
  StoreViewHistoryRepository storeViewHistoryRepository;
  @Mock
  StoreMapper storeMapper;
  @Mock
  AuthenticationService authenticationService;
  @InjectMocks
  StoreServiceImpl storeService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void create_ShouldReturnStoreAdminDetailResponse_WhenValid() throws Exception {
    User owner = User.builder().id("u1").role(Role.USER).build();
    Ward ward = Ward.builder().id("w1").province(Province.builder().id("p1").build()).build();

    StoreCreateRequest request = new StoreCreateRequest();
    Store store = Store.builder().id("s1").build();
    Store savedStore = Store.builder().id("s1").ward(ward).province(ward.getProvince()).owner(owner).build();
    StoreAdminDetailResponse expectedResponse = new StoreAdminDetailResponse();

    when(wardRepository.findById("w1")).thenReturn(Optional.of(ward));
    when(storeMapper.fromCreateRequest(request)).thenReturn(store);
    when(storeRepository.save(store)).thenReturn(savedStore);
    when(authenticationService.buildTokenWhenUpgradeUser(owner)).thenReturn("newToken");
    when(storeMapper.toAdminDetailResponse(savedStore, "newToken")).thenReturn(expectedResponse);

    StoreAdminDetailResponse response = storeService.create(request, owner);

    assertSame(response, expectedResponse);
    verify(storeRepository).save(store);
    verify(authenticationService).buildTokenWhenUpgradeUser(owner);
  }
}