package com.arenaaxis.userservice.exception.special;

import com.arenaaxis.userservice.dto.response.SuspendStoreResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DuplicateSuspendException extends RuntimeException {
  private final List<SuspendStoreResponse> duplicates;

  public DuplicateSuspendException(List<SuspendStoreResponse> duplicates) {
    super("Store suspension overlaps with existing suspends.");
    this.duplicates = duplicates;
  }
}
