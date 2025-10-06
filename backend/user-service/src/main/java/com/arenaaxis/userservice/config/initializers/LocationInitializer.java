package com.arenaaxis.userservice.config.initializers;

import com.arenaaxis.userservice.config.yaml.ProvinceConfig;
import com.arenaaxis.userservice.config.yaml.WardConfig;
import com.arenaaxis.userservice.entity.Province;
import com.arenaaxis.userservice.entity.Ward;
import com.arenaaxis.userservice.mapper.ProvinceRepository;
import com.arenaaxis.userservice.mapper.WardMapper;
import com.arenaaxis.userservice.mapper.WardRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LocationInitializer implements CommandLineRunner {
  ProvinceConfig provinceConfig;
  ProvinceRepository provinceRepository;

  WardConfig wardConfig;
  WardRepository wardRepository;
  WardMapper wardMapper;

  @Override
  public void run(String... args) throws Exception {
    initialProvinces();
    initialWards();
  }

  void initialProvinces() {
    if (!provinceRepository.findAll().isEmpty()) return;

    provinceRepository.saveAll(provinceConfig.getProvinces());
  }

  void initialWards() {
    if (!wardRepository.findAll().isEmpty()) return;

    List<Province> provinces = provinceRepository.findAll();
    Map<String, Province> provinceMap = new HashMap<>();
    provinces.forEach(province -> provinceMap.put(province.getId(), province));

    List<Ward> wards = wardConfig.getWards().stream()
      .map(request -> {
        Province province = provinceMap.get(request.getProvinceId());
        if (province == null) return null;

        Ward ward = wardMapper.toWard(request);
        ward.setProvince(province);
        return ward;
      })
      .filter(Objects::nonNull)
      .toList();

    wardRepository.saveAll(wards);
  }
}
