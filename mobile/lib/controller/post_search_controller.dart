import 'dart:developer';

import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/services/post_service.dart';
import 'package:mobile/services/location_service.dart';
import 'package:mobile/services/chat_websocket_service.dart';
import 'package:mobile/models/location.dart';
import 'package:mobile/utilities/token_storage.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/material.dart';

class PostSearchController extends GetxController {
  final PostService _postService = PostService();
  final LocationService _locationService = LocationService();
  final ChatWebSocketService _wsService = ChatWebSocketService();
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

  // Track số lượng posts của user hiện tại
  final myPostsCount = 0.obs;

  String? _token;
  String? _currentUserId;
  bool _isInitialized = false;

  @override
  void onInit() {
    super.onInit();
    if (!_isInitialized) {
      _initializeController();
      _isInitialized = true;
    }
  }

  /// Initialize controller
  Future<void> _initializeController() async {
    log('🔵 PostSearchController initialization started');
    
    // Load token và userId first
    _token = await tokenStorage.getAccessToken();
    User? user = await tokenStorage.getUserData();
    _currentUserId = user?.id;


    // Connect WebSocket if we have token and userId
    if (_token != null && _currentUserId != null) {
      await _connectWebSocket();
    } else {
      log('⚠️ Cannot connect WebSocket: missing token or userId');
    }

    // Listen to apply notifications
    _listenToApplyNotifications();

    // Load initial data
    await loadInitialData();
    
    log('🟢 PostSearchController initialization completed');
  }

  /// Connect WebSocket
  Future<void> _connectWebSocket() async {
    try {
      if (_token == null || _currentUserId == null) {
        log('❌ Cannot connect WebSocket: missing token or userId');
        return;
      }

      log('🔌 Connecting WebSocket for PostSearchController...');
      
      // Check if already connected
      if (_wsService.isConnected) {
        log('✅ WebSocket already connected');
        return;
      }
      
      await _wsService.connect(_currentUserId!, _token!);
      log('✅ WebSocket connected successfully');
    } catch (e) {
      log('❌ Error connecting WebSocket: $e');
    }
  }

  /// Listen to apply notifications from WebSocket
  void _listenToApplyNotifications() {
    // Listen to apply notifications
    _wsService.applyNotificationStream.listen((notification) {
      log('📩 Apply notification received: $notification');
      // Auto-refresh posts when notification received
      refreshPosts();
    });
    
    // Also listen to connection changes
    _wsService.connectionStream.listen((connected) {
      log('🔌 WebSocket connection status changed: $connected');
    });
  }

  /// Load data ban đầu
  Future<void> loadInitialData() async {
    log('🔵 Loading initial data...');
    
    // Token and userId already loaded in _initializeController
    
    // Load provinces và sports song song
    await Future.wait([
      _loadProvinces(),
      _loadSports(),
      _loadMyPostsCount(),
    ]);
    
    log('🔵 Provinces, Sports, MyPostsCount loaded');
    
    // Load posts với body rỗng (chỉ posts của cộng đồng, không bao gồm posts của user)
    await searchPosts(isRefresh: true);
    
    log('🟢 Initial data loaded');
  }

  /// Load số lượng posts của user hiện tại
  Future<void> _loadMyPostsCount() async {
    if (_currentUserId == null) return;
    
    try {
      final response = await _postService.getMyPosts(
        userId: _currentUserId!,
        page: 0,
        perPage: 1,
        token: _token,
      );
      
      if (response.containsKey('total')) {
        myPostsCount.value = response['total'] as int;
      } else {
        final fullResponse = await _postService.getMyPosts(
          userId: _currentUserId!,
          page: 0,
          perPage: 999,
          token: _token,
        );
        final List<dynamic> posts = fullResponse['data'] ?? [];
        myPostsCount.value = posts.length;
      }
    } catch (e) {
      log('Error loading my posts count: $e');
      myPostsCount.value = 0;
    }
  }

  /// Load danh sách provinces từ API
  Future<void> _loadProvinces() async {
    try {
      isLoadingProvinces.value = true;
      final loadedProvinces = await _locationService.fetchProvinces();
      provinces.assignAll(loadedProvinces);
    } catch (e) {
      log('Error loading provinces: $e');
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
    } finally {
      isLoadingWards.value = false;
    }
  }

  /// Tìm kiếm posts từ cộng đồng (không bao gồm posts của user hiện tại)
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
          User? user = await tokenStorage.getUserData();

      // Lọc bỏ posts của user hiện tại (nếu backend không lọc sẵn)
      final filteredPosts = newPosts.where((post) {
        final postMap = post as Map<String, dynamic>;
        final poster = postMap['poster'] as Map<String, dynamic>?;
        final posterId = poster?['id'] as String?;
        return posterId != user?.id;
      }).toList();

      if (isRefresh) {
        posts.assignAll(
          filteredPosts.map((e) => e as Map<String, dynamic>).toList()
        );
      } else {
        posts.addAll(
          filteredPosts.map((e) => e as Map<String, dynamic>).toList()
        );
      } 
     
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
    await _loadMyPostsCount();
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
    selectedWardId.value = null;
    
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

  /// Apply vào một post bằng WebSocket
  Future<void> applyToPost(String postId, int numberOfPlayers) async {
    log('🎯 applyToPost called: postId=$postId, numberOfPlayers=$numberOfPlayers');
    
    if (_currentUserId == null) {
      log('❌ No current user ID');
      Get.snackbar(
        'Lỗi',
        'Không tìm thấy thông tin người dùng',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.error,
        colorText: Get.theme.colorScheme.onError,
      );
      return;
    }

    // Check if WebSocket is connected
    log('🔌 Checking WebSocket connection: ${_wsService.isConnected}');
    if (!_wsService.isConnected) {
      log('❌ WebSocket not connected, attempting to reconnect...');
      
      // Try to reconnect
      if (_token != null && _currentUserId != null) {
        await _connectWebSocket();
        
        // Check again after reconnect attempt
        if (!_wsService.isConnected) {
          Get.snackbar(
            'Lỗi',
            'Mất kết nối. Vui lòng thử lại sau.',
            snackPosition: SnackPosition.BOTTOM,
            backgroundColor: Get.theme.colorScheme.error,
            colorText: Get.theme.colorScheme.onError,
          );
          return;
        }
      } else {
        Get.snackbar(
          'Lỗi',
          'Mất kết nối. Vui lòng thử lại sau.',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Get.theme.colorScheme.error,
          colorText: Get.theme.colorScheme.onError,
        );
        return;
      }
    }

    try {
      log('🎯 Applying to post: $postId with $numberOfPlayers players');
      
      // Send WebSocket message
      final success = _wsService.sendApplyPost(postId, numberOfPlayers);
      
      if (success) {
        log('✅ Apply post message sent successfully');
        Get.snackbar(
          'Đang xử lý',
          'Đang gửi yêu cầu tham gia...',
          snackPosition: SnackPosition.BOTTOM,
          duration: const Duration(seconds: 2),
        );
        
        // Wait for response and then refresh
        await Future.delayed(const Duration(seconds: 2));
        await refreshPosts();
        
        Get.snackbar(
          'Thành công',
          'Đã gửi yêu cầu tham gia!',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );
      } else {
        log('❌ Failed to send apply post message');
        Get.snackbar(
          'Lỗi',
          'Không thể gửi yêu cầu. Vui lòng thử lại.',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Get.theme.colorScheme.error,
          colorText: Get.theme.colorScheme.onError,
        );
      }
    } catch (e) {
      log('❌ Error applying to post: $e');
      Get.snackbar(
        'Lỗi',
        e.toString().replaceAll('Exception: ', ''),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.error,
        colorText: Get.theme.colorScheme.onError,
      );
    }
  }

  // Helper methods cho UI (giữ nguyên như cũ)

  String getProvinceName(String? provinceId) {
    if (provinceId == null) return 'N/A';
    try {
      final province = provinces.firstWhere((p) => p.id == provinceId);
      return province.name;
    } catch (e) {
      return 'N/A';
    }
  }

  String getWardName(String? wardId) {
    if (wardId == null) return 'N/A';
    try {
      final ward = wards.firstWhere((w) => w.id == wardId);
      return ward.name;
    } catch (e) {
      return 'N/A';
    }
  }

  String getSportNameById(String? sportId) {
    if (sportId == null) return 'N/A';
    try {
      final sport = sports.firstWhere((s) => s['id'] == sportId);
      return sport['name'] as String;
    } catch (e) {
      return 'N/A';
    }
  }

  String formatDate(String? dateStr) {
    if (dateStr == null) return 'N/A';
    try {
      final date = DateTime.parse(dateStr);
      return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
    } catch (e) {
      return dateStr;
    }
  }

  String formatTime(String? timeStr) {
    if (timeStr == null) return 'N/A';
    try {
      final parts = timeStr.split(':');
      return '${parts[0]}:${parts[1]}';
    } catch (e) {
      return timeStr;
    }
  }

  String formatPrice(int? price) {
    if (price == null) return 'N/A';
    return '${price.toString().replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (Match m) => '${m[1]}.',
    )}đ';
  }

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

  String getMatchDate(List<dynamic>? matches) {
    if (matches == null || matches.isEmpty) return 'N/A';
    
    try {
      final firstMatch = matches.first as Map<String, dynamic>;
      return formatDate(firstMatch['date']);
    } catch (e) {
      return 'N/A';
    }
  }

  String getSportName(Map<String, dynamic>? sport) {
    return sport?['name'] ?? 'N/A';
  }

  String getStoreName(Map<String, dynamic>? store) {
    return store?['name'] ?? 'N/A';
  }

  bool get hasActiveFilters {
    return storeName.value != null ||
        fromDate.value != null ||
        toDate.value != null ||
        selectedProvinceId.value != null ||
        selectedWardId.value != null ||
        selectedSportId.value != null;
  }

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