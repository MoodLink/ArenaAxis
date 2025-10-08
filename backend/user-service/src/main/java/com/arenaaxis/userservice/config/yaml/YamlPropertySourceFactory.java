package com.arenaaxis.userservice.config.yaml;

import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.core.env.CompositePropertySource;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.core.io.support.PropertySourceFactory;

import java.io.IOException;
import java.util.List;

public class YamlPropertySourceFactory implements PropertySourceFactory {

  @Override
  public PropertySource<?> createPropertySource(String name, EncodedResource resource)
    throws IOException {
    YamlPropertySourceLoader loader = new YamlPropertySourceLoader();
    List<PropertySource<?>> sources = loader.load(resource.getResource().getFilename(), resource.getResource());

    if (sources.isEmpty()) {
      return null;
    }

    PropertySource<?> result;
    if (sources.size() == 1) {
      result = sources.get(0);
    } else {
      CompositePropertySource composite = new CompositePropertySource(name);
      sources.forEach(composite::addPropertySource);
      result = composite;
    }

    return result;
  }
}
