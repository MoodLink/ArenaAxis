
import 'dart:convert';
import 'dart:developer';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:mobile/models/Authentiacate.dart';
import 'package:mobile/models/User.dart';

class TokenStorage {
  static const String ACCESS_TOKEN_KEY = 'access_token';
  static const String REFRESH_TOKEN_KEY = 'refresh_token';
  static const String USER_KEY = 'user';
  static const String LOCATION_KEY = 'user_location';
  static const String first_open = 'first_open_app';
  final FlutterSecureStorage _storage;

  TokenStorage({required FlutterSecureStorage storage}) : _storage = storage;
  // Phương thức mới để lấy thông tin user đã lưu
  Future<User?> getUserData() async {
    final userJsonString = await _storage.read(key: USER_KEY);
    if (userJsonString != null && userJsonString.isNotEmpty) {
      try {
        final userMap = jsonDecode(userJsonString) as Map<String, dynamic>;
        return User.fromJson(userMap);
      } catch (e) {
        log('Error decoding user data: $e');
        return null;
      }
    }
    return null;
  }

  Future<void> saveTokens(AuthResponse auth) async {
    log("Saving tokens...");
    // Lưu access token
    await _storage.write(key: ACCESS_TOKEN_KEY, value: auth.accessToken);
    log("Access Token saved: ${auth.accessToken}");
    // Lưu refresh token (sửa: thêm dòng này nếu AuthResponse có refreshToken)
    if (auth.refreshToken != null) {
      await _storage.write(key: REFRESH_TOKEN_KEY, value: auth.refreshToken);
      log("Refresh Token saved: ${auth.refreshToken}");
    }
    // Lưu thông tin user
    await _storage.write(key: USER_KEY, value: jsonEncode(auth.user.toJson()));
    await _storage.write(key: first_open, value: 'true');
  }

  Future<void> clear() async {
    await _storage.delete(key: ACCESS_TOKEN_KEY);
    await _storage.delete(key: REFRESH_TOKEN_KEY);
    await _storage.delete(key: USER_KEY);
  }

  Future<String?> getAccessToken() async {
    return await _storage.read(key: ACCESS_TOKEN_KEY);
  }

  Future<String?> getFirstOpen() async {
    String? value = await _storage.read(key: first_open);
    if (value != null) {
      return value;
    }
    return null;
  }

  Future<String?> getRefreshToken() async {
    return await _storage.read(key: REFRESH_TOKEN_KEY);
  }
}