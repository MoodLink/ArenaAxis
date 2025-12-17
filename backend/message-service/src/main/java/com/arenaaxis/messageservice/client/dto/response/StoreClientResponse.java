package com.arenaaxis.messageservice.client.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreClientResponse {
  String id;
  String name;
  String address;
  Ward ward;
  Province province;

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class Ward {
    String id;
    String name;
  }

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class Province {
    String id;
    String name;
  }
}
