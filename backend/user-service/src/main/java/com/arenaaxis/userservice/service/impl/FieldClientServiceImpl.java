package com.arenaaxis.userservice.service.impl;

import com.arenaaxis.userservice.dto.response.OrderServiceResponseTemplate;
import com.arenaaxis.userservice.exception.AppException;
import com.arenaaxis.userservice.exception.ErrorCode;
import com.arenaaxis.userservice.service.FieldClientService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FieldClientServiceImpl implements FieldClientService {
  RestTemplate restTemplate;

  @Value("${service.order.url}")
  @NonFinal
  String orderUrl;

  @Override
  public List<String> getStoreIdsBySportId(String sportId) {
    String url = orderUrl + "/api/v1/fields/store?sport_id=" + sportId;
    try {
      ResponseEntity<OrderServiceResponseTemplate<List<String>>> response = restTemplate.exchange(
        url,
        HttpMethod.GET,
        null,
        new ParameterizedTypeReference<>() {}
      );
      return Objects.requireNonNull(response.getBody()).getData();
    } catch (Exception e) {
      throw new AppException(ErrorCode.CANNOT_REQUEST_TO_ORDER_SERVICE);
    }
  }
}
