import 'dart:developer';

import 'package:shared_preferences/shared_preferences.dart';

class LocalStorageHelper {
  static const String _latitudeKey = 'latitude';
  static const String _longitudeKey = 'longitude';
  static const String _wardKey = 'ward';
  static const String _provinceKey = 'province';

  /// Lưu thông tin vị trí (Map gồm lat, long, address)
  static Future<void> saveLocation(Map<String, dynamic> location) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_provinceKey, location['address'] ?? '');
    await prefs.setDouble(_latitudeKey, location['latitude'] ?? 0.0);
    await prefs.setDouble(_longitudeKey, location['longitude'] ?? 0.0);
    await prefs.setString(_wardKey, location['ward'] ?? '');
    await prefs.setString(_provinceKey, location['province'] ?? '');
  }

  /// Lấy thông tin vị trí đã lưu (chỉ cần address)
  static Future<String?> getSavedLocation() async {
    final prefs = await SharedPreferences.getInstance();
    log(prefs.getString(_provinceKey) ?? "No location saved");
    return prefs.getString(_provinceKey);
  }
  static Future<double?> getLatitude() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getDouble(_latitudeKey);
  }
  static Future<double?> getLongitude() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getDouble(_longitudeKey);
  }
  static Future<String?> getWard() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_wardKey);
  }
  static Future<String?> getProvince() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_provinceKey);
  }
  /// Xóa vị trí đã lưu (nếu cần reset)
  static Future<void> clearLocation() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_provinceKey);
  }
}
