package com.arenaaxis.userservice.config.yaml;

import com.arenaaxis.userservice.entity.Sport;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import java.util.List;

@Data
@Configuration
@PropertySource(value = "classpath:/data/sports.yml", factory = YamlPropertySourceFactory.class)
@ConfigurationProperties(prefix = "")
public class SportConfig {
  private List<Sport> sports;
}
