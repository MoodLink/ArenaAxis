package com.arenaaxis.userservice.config.yaml;

import com.arenaaxis.userservice.dto.request.WardRequest;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import java.util.List;

@Data
@Configuration
@PropertySource(value = "classpath:/data/wards.yml", factory = YamlPropertySourceFactory.class)
@ConfigurationProperties(prefix = "")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WardConfig {
  List<WardRequest> wards;
}
