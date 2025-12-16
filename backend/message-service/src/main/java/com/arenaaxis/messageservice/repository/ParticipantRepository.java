package com.arenaaxis.messageservice.repository;

import com.arenaaxis.messageservice.model.Participant;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface ParticipantRepository extends ReactiveMongoRepository<Participant, String> {
}
