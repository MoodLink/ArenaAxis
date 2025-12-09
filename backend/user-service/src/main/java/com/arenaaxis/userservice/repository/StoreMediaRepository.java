package com.arenaaxis.userservice.repository;

import com.arenaaxis.userservice.entity.Media;
import com.arenaaxis.userservice.entity.StoreMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreMediaRepository extends JpaRepository<StoreMedia, String> {
  @Query("select sm.media from StoreMedia sm where sm.store.id = :storeId")
  List<Media> findByStoreId(String storeId);
}
