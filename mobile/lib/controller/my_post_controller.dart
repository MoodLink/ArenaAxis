import 'package:get/get.dart';
import 'package:mobile/services/post_service.dart';
import 'package:mobile/utilities/token_storage.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:mobile/models/user.dart';

class MyPostsController extends GetxController {
  final PostService _postService = PostService();
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

  String? _token;
  String? _currentUserId;

  @override
  void onInit() {
    super.onInit();
    loadInitialData();
  }

  /// Load data ban đầu
  Future<void> loadInitialData() async {
    // Load token và userId
    _token = await tokenStorage.getAccessToken();
    User? currentUser = await tokenStorage.getUserData();
    _currentUserId = currentUser?.id;

    // Load posts của user
    await loadMyPosts(isRefresh: true);
  }

  /// Load posts của user hiện tại
  Future<void> loadMyPosts({bool isRefresh = false}) async {
    try {
      if (isRefresh) {
        isLoading.value = true;
        currentPage.value = 0;
        posts.clear();
      } else {
        isLoadingMore.value = true;
      }
      User? currentUser = await tokenStorage.getUserData();
      _currentUserId = currentUser?.id;
      errorMessage.value = null;

      if (_currentUserId == null) {
        throw Exception('Không tìm thấy thông tin người dùng');
      }

      final response = await _postService.getMyPosts(
        userId: _currentUserId!,
        page: currentPage.value,
        perPage: perPage,
        token: _token,
      );

      final List<dynamic> newPosts = response['data'] ?? [];

      if (isRefresh) {
        posts.assignAll(
          newPosts.map((e) => e as Map<String, dynamic>).toList(),
        );
      } else {
        posts.addAll(newPosts.map((e) => e as Map<String, dynamic>).toList());
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
    await loadMyPosts(isRefresh: false);
  }

  /// Refresh posts
  Future<void> refreshPosts() async {
    await loadMyPosts(isRefresh: true);
  }

  // Helper methods cho UI

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
    return '${price.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}đ';
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
}
