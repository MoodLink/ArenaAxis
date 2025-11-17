import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;
import 'package:mobile/models/Store.dart';
import 'package:percent_indicator/percent_indicator.dart';

class StoreService {
  final String baseUrl = 'https://arena-user-service.onrender.com';

  /// Lấy danh sách cửa hàng gần vị trí
  /// latitude, longitude, distance là bắt buộc
  /// wardName, provinceName là optional
  Future<List<Store>> getStoresNearby({
    double? latitude,
    double? longitude,
    int? distance, // meters
    String? wardName,
    String? provinceName,
  }) async {
    try {
      final Uri uri = Uri.parse('$baseUrl/recommends/near-by');
      log('Fetching stores from: $uri');

      // Tạo body JSON, chỉ include các giá trị không null
      final Map<String, dynamic> bodyMap = {
        // // if (latitude != null  && latitude.isZero)    "latitude": latitude,
        // // if (longitude != null && longitude.isZero)  "longitude": longitude,
        // // if (distance != null && distance.isNegative) "distance": distance,
        // if (wardName != null && wardName.isNotEmpty) "wardName": wardName,
        if (provinceName != null && provinceName.isNotEmpty) "provinceName": provinceName,
      };

      final response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: json.encode(bodyMap),
      );

      log('Response status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Store.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load stores: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching stores: $e');
    }
  }
}
