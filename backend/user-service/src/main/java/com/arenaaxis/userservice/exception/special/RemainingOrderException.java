package com.arenaaxis.userservice.exception.special;

import com.arenaaxis.userservice.dto.response.RemainingOrderResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RemainingOrderException extends RuntimeException {
  private final List<RemainingOrderResponse> orders;

  public RemainingOrderException(List<RemainingOrderResponse> orders) {
    super("There are still court reservations available during the above period");
    this.orders = orders;
  }
}
