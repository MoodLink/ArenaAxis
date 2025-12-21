package com.arenaaxis.userservice.client.api;

import com.arenaaxis.userservice.client.dto.request.OrdersByStoreRequest;
import com.arenaaxis.userservice.client.dto.response.OrderClientResponse;
import com.arenaaxis.userservice.client.dto.response.OrderServiceResponse;
import com.arenaaxis.userservice.utility.TimeFormatter;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderApi {

  @Qualifier(value = "orderWebClient")
  WebClient orderWebClient;

  public List<OrderClientResponse> getOrdersByStore(OrdersByStoreRequest request) {
    String startTime = TimeFormatter.convertDateFormatToString(request.getStartTime());
    String endTime = TimeFormatter.convertDateFormatToString(request.getEndTime());

    OrderServiceResponse<List<OrderClientResponse>> response =
      orderWebClient.get()
        .uri(uriBuilder -> {
          uriBuilder.path("/orders/store/{storeId}");
          if (startTime != null) uriBuilder.queryParam("play_date_start", startTime);
          if (endTime != null) uriBuilder.queryParam("play_date_end", endTime);
          return uriBuilder.build(request.getStoreId());
        })
        .retrieve()
        .bodyToMono(new ParameterizedTypeReference<OrderServiceResponse<List<OrderClientResponse>>>() {})
        .block();
    return response == null ? List.of() : response.getData();
  }
}
