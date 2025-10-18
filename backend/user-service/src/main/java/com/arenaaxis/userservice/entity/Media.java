package com.arenaaxis.userservice.entity;

import com.arenaaxis.userservice.entity.enums.MediaType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Media {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  String url;

  @Enumerated(EnumType.STRING)
  MediaType mediaType;
}
