package com.arenaaxis.userservice.service;

import java.util.List;

public interface FieldClientService {
  List<String> getStoreIdsBySportId(String sportId);
}
