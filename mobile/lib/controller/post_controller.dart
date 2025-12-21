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
      log('Loaded token: $_token');
      log('Loaded user: ${_user?.id}');

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
          response.map((e) => e as Map<String, dynamic>).toList(),
        );
      } else {

        matches.assignAll([]);
      }

    } catch (e) {
      errorMessage.value = e.toString().replaceAll('Exception: ', '');
      log('Load matches error: $e');
    } finally {
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
    log('Selected matches: ${selectedMatchIds.length}');
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
        errorMessage.value = 'Vui lòng chọn ít nhất một trận đấu';
        return false;
      }

      isLoading.value = true;
      errorMessage.value = null;

      // Lấy lại token và user nếu null (phòng trường hợp user chưa load matches)
      if (_token == null || _user == null) {
        _token = await tokenStorage.getAccessToken();
        _user = await tokenStorage.getUserData();

        if (_token == null) {
          errorMessage.value = 'Vui lòng đăng nhập lại';
          return false;
        }

        if (_user == null) {
          errorMessage.value = 'Không tìm thấy thông tin người dùng';
          return false;
        }
      }



      final result = await _service.createPost(
        matchIds: selectedMatchIds.toList(),
        title: title,
        description: description,
        requiredNumber: requiredNumber,
        currentNumber: currentNumber,
        userId: _user!.id,
        token: _token!,
      );

      log('Create post result: $result');

      // ✅ FIX: CHỈ CLEAR DATA SAU KHI TẠO POST THÀNH CÔNG
      selectedMatchIds.clear();
      matches.clear();

      return true;
    } catch (e) {
      errorMessage.value = e.toString().replaceAll('Exception: ', '');
      log('Create post error: $e');
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  @override
  void onClose() {
    log('PostController onClose called');

    super.onClose();
  }

  void reset() {
    log('PostController reset called');
    matches.clear();
    selectedMatchIds.clear();
    errorMessage.value = null;
    _token = null;
    _user = null;
    _currentOrderId = null;
  }
}
