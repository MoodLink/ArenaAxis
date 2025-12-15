package com.arenaaxis.messageservice.repository;

import com.arenaaxis.messageservice.model.Store;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface StoreRepository extends ReactiveMongoRepository<Store, String> {
}
