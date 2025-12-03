import 'dart:developer';
import 'package:get/get.dart';
import 'package:mobile/models/Store.dart';
import 'package:mobile/services/store_service.dart';
import 'package:mobile/utilities/local_storage.dart';

class StoreController extends GetxController {
  final stores = <Store>[].obs;
  final isLoading = false.obs;
  final StoreService _storeService = StoreService();
  
  // Search filters
  final searchQuery = ''.obs;
  final selectedSportId = ''.obs;
  final selectedWardId = ''.obs;
  final selectedProvinceId = ''.obs;
  
  @override
  void onInit() {
    super.onInit();
    fetchStores();
  }

  /// Fetch stores with optional filters
  Future<void> fetchStores({
    String? name,
    String? wardId,
    String? provinceId,
    String? sportId,
    int distance = 10000,
  }) async {
    try {
      isLoading.value = true;

      // Lấy tọa độ từ local storage
      final latitude = await LocalStorageHelper.getLatitude();
      final longitude = await LocalStorageHelper.getLongitude();
      final ward = wardId ?? await LocalStorageHelper.getWard();
      final province = provinceId ?? await LocalStorageHelper.getProvince();
      
      final result = await _storeService.getStoresNearby(
        latitude: latitude!,
        longitude: longitude!,
        distance: distance,
        wardName: ward!,
        provinceName: province,
      );

      log('Fetched ${result.length} stores');
      stores.assignAll(result);
    } catch (e) {
      Get.snackbar('Lỗi', e.toString());
    } finally {
      isLoading.value = false;
    }
  }

  /// Search stores with filters
  Future<void> searchStores({
    String? name,
    String? wardId,
    String? provinceId,
    String? sportId,
  }) async {
    try {
      isLoading.value = true;

      final result = await _storeService.searchStores(
        name: name ?? '',
        wardId: wardId ?? selectedWardId.value,
        provinceId: provinceId ?? selectedProvinceId.value,
        sportId: sportId ?? selectedSportId.value,
      );

      log('Search returned ${result.length} stores'); 
      stores.assignAll(result);
    } catch (e) {
      Get.snackbar('Lỗi', 'Tìm kiếm thất bại: $e');
    } finally {
      isLoading.value = false;
    }
  }

  /// Update search query and search
  void updateSearchQuery(String query) {
    searchQuery.value = query;
  }

  /// Select sport category and search
  void selectSportCategory(String sportId) {
    selectedSportId.value = selectedSportId.value == sportId ? '' : sportId;
    performSearch();
  }

  /// Update ward filter and search
  void updateWardFilter(String wardId) {
    selectedWardId.value = wardId;
  }

  /// Update province filter and search
  void updateProvinceFilter(String provinceId) {
    selectedProvinceId.value = provinceId;
  }

  /// Perform search with current filters
  Future<void> performSearch() async {
    await searchStores(
      name: searchQuery.value,
      wardId: selectedWardId.value.isEmpty ? null : selectedWardId.value,
      provinceId: selectedProvinceId.value.isEmpty ? null : selectedProvinceId.value,
      sportId: selectedSportId.value.isEmpty ? null : selectedSportId.value,
    );
  }

  /// Clear all filters
  void clearFilters() {
    searchQuery.value = '';
    selectedSportId.value = '';
    selectedWardId.value = '';
    selectedProvinceId.value = '';
    fetchStores();
  }
}