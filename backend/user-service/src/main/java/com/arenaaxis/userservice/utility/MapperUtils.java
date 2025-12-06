package com.arenaaxis.userservice.utility;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

public class MapperUtils {
  private MapperUtils() {}

  public static Map<String, Object> toMap(Object obj) {
    return new ObjectMapper().convertValue(obj, new TypeReference<>() {});
  }
}
