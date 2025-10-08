package com.arenaaxis.userservice.utility;

import com.arenaaxis.userservice.dto.request.FieldCreateRequest;
import com.arenaaxis.userservice.dto.response.FieldResponse;

public interface FieldService {
  FieldResponse create(FieldCreateRequest request);
}
