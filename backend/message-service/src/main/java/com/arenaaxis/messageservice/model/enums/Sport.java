package com.arenaaxis.messageservice.model.enums;

import com.arenaaxis.messageservice.dto.response.SportResponse;
import lombok.Getter;

@Getter
public enum Sport {
  FOOTBALL("football", "Bóng đá", "Football"),
  BADMINTON("badminton", "Cầu lông", "Badminton"),
  PICKLEBALL("pickleball", "Pickle Ball", "Pickle Ball"),
  TENNIS("tennis", "Quần vợt", "Tennis"),
  PINGPONG("pingpong", "Bóng bàn", "Ping Pong"),
  VOLLEYBALL("volleyball", "Bóng chuyền", "Volleyball"),
  BASKETBALL("basketball", "Bóng rổ", "Basketball");
  ;

  private final String id;
  private final String name;
  private final String nameEn;

  Sport(String id, String name, String nameEn) {
    this.id = id;
    this.name = name;
    this.nameEn = nameEn;
  }

  public static Sport getById(String id) {
    for (Sport sport : Sport.values()) {
      if (sport.getId().equals(id)) {
        return sport;
      }
    }

    return null;
  }

  public SportResponse toResponse() {
    return SportResponse.builder()
      .id(this.getId())
      .name(this.getName())
      .nameEn(this.getNameEn())
      .build();
  }
}
