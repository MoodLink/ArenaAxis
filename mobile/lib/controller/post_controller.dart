import 'dart:developer';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/services/post_service.dart';
import 'package:mobile/utilities/token_storage.dart';

class PostController extends GetxController {
  final PostService _service = PostService();
  final tokenStorage = TokenStorage(storage: const FlutterSecureStorage());

  // Observable lists và states
  final matches = <Map<String, dynamic>>[].obs;
  final selectedMatchIds = <String>[].obs;
  final isLoading = false.obs;
  final errorMessage = Rxn<String>();

  String? _currentOrderId;
  String? _token;
  User? _user;

  /// Load danh sách matches từ một order
  Future<void> loadMatches(String orderId) async {
    try {
      isLoading.value = true;
      errorMessage.value = null;
      _currentOrderId = orderId;

      // Lấy token và user info
      _token = await tokenStorage.getAccessToken();
      _user = await tokenStorage.getUserData();
      log('Loaded token: $_token, user: $_user');
      if (_token == null) {
        throw Exception('Vui lòng đăng nhập lại');
      }

      if (_user == null) {
        throw Exception('Không tìm thấy thông tin người dùng');
      }

      final response = await _service.getMatchesByOrder(orderId, _token!);
      
      // API trả về trực tiếp là List các matches
      if (response is List) {
        matches.assignAll(
          response.map((e) => e as Map<String, dynamic>).toList()
        );
      } else {
        // Trường hợp backup nếu format thay đổi
        matches.assignAll([]);
      }

      // Clear selection
      selectedMatchIds.clear();

      isLoading.value = false;
    } catch (e) {
      errorMessage.value = e.toString().replaceAll('Exception: ', '');
      isLoading.value = false;
    }
  }

  /// Toggle selection của một match
  void toggleMatchSelection(String matchId) {
    if (selectedMatchIds.contains(matchId)) {
      selectedMatchIds.remove(matchId);
    } else {
      selectedMatchIds.add(matchId);
    }
  }

  /// Check xem match có được chọn không
  bool isMatchSelected(String matchId) {
    return selectedMatchIds.contains(matchId);
  }

  /// Tạo post
  Future<bool> createPost({
    required String title,
    required String description,
    required int requiredNumber,
    required int currentNumber,
  }) async {
    try {
      if (selectedMatchIds.isEmpty) {
        throw Exception('Vui lòng chọn ít nhất một trận đấu');
      }

      if (_token == null || _user == null) {
        throw Exception('Vui lòng đăng nhập lại');
      }

      isLoading.value = true;
      errorMessage.value = null;

      await _service.createPost(
        matchIds: selectedMatchIds.toList(),
        title: title,
        description: description,
        requiredNumber: requiredNumber,
        currentNumber: currentNumber,
        userId: _user!.id,
        token: _token!,
      );

      isLoading.value = false;
      return true;
    } catch (e) {
      errorMessage.value = e.toString().replaceAll('Exception: ', '');
      isLoading.value = false;
      return false;
    }
  }

  /// Clear data khi dispose
  @override
  void onClose() {
    matches.clear();
    selectedMatchIds.clear();
    super.onClose();
  }
}