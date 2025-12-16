package com.arenaaxis.messageservice.repository;

import com.arenaaxis.messageservice.model.Conversation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ConversationRepository extends ReactiveMongoRepository<Conversation, String> {
  @Query("{ participantIds: { $all: [?0, ?1] } }")
  Flux<Conversation> findCandidates(String user1, String user2);

  default Mono<Conversation> findOneToOne(String user1, String user2) {
    return findCandidates(user1, user2)
      .filter(c -> c.getParticipantIds().size() == 2)
      .next();
  }

  Flux<Conversation> findByParticipantIdsContains(String userId, Pageable pageable);

  @Aggregation(pipeline = {
    "{ $match: { participantIds: ?0 } }",
    "{ $lookup: { from: 'participants', localField: 'participantIds', foreignField: '_id', as: 'participantsInfo' } }",
    "{ $addFields: { otherParticipants: { "
      + "$filter: { "
      + "input: '$participantsInfo', "
      + "as: 'p', "
      + "cond: { $ne: ['$$p._id', ?0] } "
      + "} "
      + "} } }",
    "{ $match: { 'otherParticipants.name': { $regex: ?1, $options: 'i' } } }",
    "{ $sort: { lastMessageAt: -1 } }",
    "{ $skip:  ?2 }",
    "{ $limit: ?3 }"
  })
  Flux<Conversation> findByUserIdAndReceiverNameLike(String userId, String keyword, int skip, int limit);
}
