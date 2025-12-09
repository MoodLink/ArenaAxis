// package com.arenaaxis.userservice.service.impl;

// import com.arenaaxis.userservice.dto.request.SearchStoreRequest;
// import com.arenaaxis.userservice.entity.Store;
// import com.arenaaxis.userservice.repository.StoreRepository;
// import com.arenaaxis.userservice.service.FieldClientService;
// import com.arenaaxis.userservice.service.SearchStoreService;
// import com.arenaaxis.userservice.specification.StoreSpecification;
// import lombok.AccessLevel;
// import lombok.RequiredArgsConstructor;
// import lombok.experimental.FieldDefaults;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;
// import org.springframework.data.jpa.domain.Specification;
// import org.springframework.stereotype.Service;

// import java.util.List;

// @Service
// @RequiredArgsConstructor
// @FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
// public class SearchStoreServiceImpl implements SearchStoreService {
//   static int BATCH_SIZE = 500;

//   StoreRepository storeRepository;
//   FieldClientService fieldClientService;

//   @Override
//   public List<Store> search(SearchStoreRequest request, int page, int perPage) {
//     List<String> storeIds = null;
//     if (request.getSportId() != null) {
//       storeIds = fieldClientService.getStoreIdsBySportId(request.getSportId());
//       if (storeIds.isEmpty()) {
//         return List.of();
//       }
//     }

//     Pageable pageable = PageRequest.of(page - 1, perPage);

//     Specification<Store> stores = StoreSpecification.searchStoreInIds(request, storeIds);
//     return List.of();
//   }
// }
