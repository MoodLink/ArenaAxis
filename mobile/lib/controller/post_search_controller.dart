import 'dart:developer';

import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:mobile/services/post_service.dart';
import 'package:mobile/services/location_service.dart';
import 'package:mobile/models/location.dart';
import 'package:mobile/utilities/token_storage.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class PostSearchController extends GetxController {
  final PostService _postService = PostService();
  final LocationService _locationService = LocationService();
  final tokenStorage = TokenStorage(storage: const FlutterSecureStorage());

  // Observable lists và states
  final posts = <Map<String, dynamic>>[].obs;
  final isLoading = false.obs;
  final isLoadingMore = false.obs;
  final errorMessage = Rxn<String>();

  // Pagination
  final currentPage = 0.obs;
  final perPage = 12;
  final hasMore = true.obs;

  // Search filters
  final storeName = Rxn<String>();
  final fromDate = Rxn<DateTime>();
  final toDate = Rxn<DateTime>();
  final selectedProvinceId = Rxn<String>();
  final selectedWardId = Rxn<String>();
  final selectedSportId = Rxn<String>();

  // Data for dropdowns
  final provinces = <Province>[].obs;
  final wards = <Ward>[].obs;
  final sports = <Map<String, dynamic>>[].obs;

  // Loading states
  final isLoadingProvinces = false.obs;
  final isLoadingWards = false.obs;
  final isLoadingSports = false.obs;

  String? _token;

  @override
  void onInit() {
    super.onInit();
    loadInitialData();
  }

  /// Load data ban đầu
  Future<void> loadInitialData() async {
    // Load token
    _token = await tokenStorage.getAccessToken();

    // Load provinces và sports song song
    await Future.wait([
      _loadProvinces(),
      _loadSports(),
    ]);
    
    // Load posts với body rỗng
    await searchPosts(isRefresh: true);
  }

  /// Load danh sách provinces từ API
  Future<void> _loadProvinces() async {
    try {
      isLoadingProvinces.value = true;
      final loadedProvinces = await _locationService.fetchProvinces();
      provinces.assignAll(loadedProvinces);
    } catch (e) {
      log('Error loading provinces: $e');
      // Không show error cho user, chỉ log
    } finally {
      isLoadingProvinces.value = false;
    }
  }

  /// Load danh sách sports từ API
  Future<void> _loadSports() async {
    try {
      isLoadingSports.value = true;
      final response = await _postService.getSports();
      
      if (response is List) {
        sports.assignAll(
          response.map((e) => e as Map<String, dynamic>).toList()
        );
      }
    } catch (e) {
      log('Error loading sports: $e');
      // Fallback to default sports if API fails
      sports.assignAll([
        {'id': 'football', 'name': 'Bóng đá', 'nameEn': 'Football'},
        {'id': 'basketball', 'name': 'Bóng rổ', 'nameEn': 'Basketball'},
        {'id': 'badminton', 'name': 'Cầu lông', 'nameEn': 'Badminton'},
        {'id': 'volleyball', 'name': 'Bóng chuyền', 'nameEn': 'Volleyball'},
      ]);
    } finally {
      isLoadingSports.value = false;
    }
  }

  /// Load wards theo province từ API
  Future<void> _loadWards(String provinceId) async {
    try {
      isLoadingWards.value = true;
      wards.clear();
      
      final loadedWards = await _locationService.fetchWards(provinceId);
      wards.assignAll(loadedWards);
    } catch (e) {
      log('Error loading wards: $e');
      // Không show error cho user, chỉ log
    } finally {
      isLoadingWards.value = false;
    }
  }

  /// Tìm kiếm posts
  Future<void> searchPosts({bool isRefresh = false}) async {
    try {
      if (isRefresh) {
        isLoading.value = true;
        currentPage.value = 0;
        posts.clear();
      } else {
        isLoadingMore.value = true;
      }

      errorMessage.value = null;

      final response = await _postService.searchPosts(
        page: currentPage.value,
        perPage: perPage,
        storeName: storeName.value,
        fromDate: fromDate.value != null 
            ? DateFormat('yyyy-MM-dd').format(fromDate.value!)
            : null,
        toDate: toDate.value != null
            ? DateFormat('yyyy-MM-dd').format(toDate.value!)
            : null,
        provinceId: selectedProvinceId.value,
        wardId: selectedWardId.value,
        sportId: selectedSportId.value,
        token: _token,
      );

      final List<dynamic> newPosts = response['data'] ?? [];

      if (isRefresh) {
        posts.assignAll(
          newPosts.map((e) => e as Map<String, dynamic>).toList()
        );
      } else {
        posts.addAll(
          newPosts.map((e) => e as Map<String, dynamic>).toList()
        );
      } 

      // Check if there are more posts
      hasMore.value = newPosts.length >= perPage;
      isLoading.value = false;
      isLoadingMore.value = false;
    } catch (e) {
      errorMessage.value = e.toString().replaceAll('Exception: ', '');
      isLoading.value = false;
      isLoadingMore.value = false;
    }
  }

  /// Load more posts (pagination)
  Future<void> loadMore() async {
    if (!hasMore.value || isLoadingMore.value) return;
    
    currentPage.value++;
    await searchPosts(isRefresh: false);
  }

  /// Refresh posts
  Future<void> refreshPosts() async {
    await searchPosts(isRefresh: true);
  }

  /// Apply filters và search lại
  Future<void> applyFilters() async {
    await searchPosts(isRefresh: true);
  }

  /// Clear tất cả filters
  void clearFilters() {
    storeName.value = null;
    fromDate.value = null;
    toDate.value = null;
    selectedProvinceId.value = null;
    selectedWardId.value = null;
    selectedSportId.value = null;
    wards.clear();
  }

  /// Set store name filter
  void setStoreName(String? value) {
    storeName.value = value?.trim().isEmpty ?? true ? null : value?.trim();
  }

  /// Set from date
  void setFromDate(DateTime? date) {
    fromDate.value = date;
  }

  /// Set to date
  void setToDate(DateTime? date) {
    toDate.value = date;
  }

  /// Set province và load wards
  void setProvince(String? provinceId) {
    selectedProvinceId.value = provinceId;
    selectedWardId.value = null; // Reset ward khi đổi province
    
    if (provinceId != null && provinceId.isNotEmpty) {
      _loadWards(provinceId);
    } else {
      wards.clear();
    }
  }

  /// Set ward
  void setWard(String? wardId) {
    selectedWardId.value = wardId;
  }

  /// Set sport
  void setSport(String? sportId) {
    selectedSportId.value = sportId;
  }

  // Helper methods cho UI

  /// Get province name by ID
  String getProvinceName(String? provinceId) {
    if (provinceId == null) return 'N/A';
    try {
      final province = provinces.firstWhere((p) => p.id == provinceId);
      return province.name;
    } catch (e) {
      return 'N/A';
    }
  }

  /// Get ward name by ID
  String getWardName(String? wardId) {
    if (wardId == null) return 'N/A';
    try {
      final ward = wards.firstWhere((w) => w.id == wardId);
      return ward.name;
    } catch (e) {
      return 'N/A';
    }
  }

  /// Get sport name by ID
  String getSportNameById(String? sportId) {
    if (sportId == null) return 'N/A';
    try {
      final sport = sports.firstWhere((s) => s['id'] == sportId);
      return sport['name'] as String;
    } catch (e) {
      return 'N/A';
    }
  }

  /// Format ngày
  String formatDate(String? dateStr) {
    if (dateStr == null) return 'N/A';
    try {
      final date = DateTime.parse(dateStr);
      return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
    } catch (e) {
      return dateStr;
    }
  }

  /// Format thời gian
  String formatTime(String? timeStr) {
    if (timeStr == null) return 'N/A';
    try {
      final parts = timeStr.split(':');
      return '${parts[0]}:${parts[1]}';
    } catch (e) {
      return timeStr;
    }
  }

  /// Format giá
  String formatPrice(int? price) {
    if (price == null) return 'N/A';
    return '${price.toString().replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (Match m) => '${m[1]}.',
    )}đ';
  }

  /// Get time range từ matches
  String getTimeRange(List<dynamic>? matches) {
    if (matches == null || matches.isEmpty) return 'N/A';
    
    try {
      final firstMatch = matches.first as Map<String, dynamic>;
      final lastMatch = matches.last as Map<String, dynamic>;
      
      final startTime = formatTime(firstMatch['startTime']);
      final endTime = formatTime(lastMatch['endTime']);
      
      return '$startTime - $endTime';
    } catch (e) {
      return 'N/A';
    }
  }

  /// Get date từ matches
  String getMatchDate(List<dynamic>? matches) {
    if (matches == null || matches.isEmpty) return 'N/A';
    
    try {
      final firstMatch = matches.first as Map<String, dynamic>;
      return formatDate(firstMatch['date']);
    } catch (e) {
      return 'N/A';
    }
  }

  /// Get sport name
  String getSportName(Map<String, dynamic>? sport) {
    return sport?['name'] ?? 'N/A';
  }

  /// Get store name
  String getStoreName(Map<String, dynamic>? store) {
    return store?['name'] ?? 'N/A';
  }

  /// Check if has active filters
  bool get hasActiveFilters {
    return storeName.value != null ||
        fromDate.value != null ||
        toDate.value != null ||
        selectedProvinceId.value != null ||
        selectedWardId.value != null ||
        selectedSportId.value != null;
  }

  /// Get active filters count
  int get activeFiltersCount {
    int count = 0;
    if (storeName.value != null) count++;
    if (fromDate.value != null) count++;
    if (toDate.value != null) count++;
    if (selectedProvinceId.value != null) count++;
    if (selectedWardId.value != null) count++;
    if (selectedSportId.value != null) count++;
    return count;
  }
}