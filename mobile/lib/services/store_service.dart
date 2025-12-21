import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;
import 'package:mobile/models/Store.dart';

class StoreService {
  final String _baseUrl = 'https://www.executexan.store';

  /// Search stores with filters - POST to /stores/search
  Future<List<Store>> searchStores({
    required String name,
    required String wardId,
    required String provinceId,
    required String sportId,
  }) async {
    try {
      final url = Uri.parse('$_baseUrl/stores/search');

      // Chỉ thêm field nếu giá trị không rỗng và không phải là "null" string
      final Map<String, dynamic> body = {};

      if (name.isNotEmpty) {
        body['name'] = name;
      }
      if (wardId.isNotEmpty && wardId != 'null') {
        body['wardId'] = wardId;
      }
      if (provinceId.isNotEmpty && provinceId != 'null') {
        body['provinceId'] = provinceId;
      }
      if (sportId.isNotEmpty && sportId != 'null') {
        body['sportId'] = sportId;
      }

      // Nếu tất cả đều rỗng → có thể trả về sớm hoặc để backend xử lý
      log('Searching stores with body: $body');

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body), // Chỉ gửi những field có giá trị
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        final stores = data.map((e) => Store.fromJson(e)).toList();
        log('Got ${stores.length} stores from search');
        return stores;
      } else {
        throw Exception(
          'Failed to search stores: ${response.statusCode} ${response.body}',
        );
      }
    } catch (e) {
      log('Error searching stores: $e');
      rethrow;
    }
  }

  Future<Map<String, dynamic>> getStoreDetail(String storeId) async {
    try {
      final url = Uri.parse('$_baseUrl/stores/detail/$storeId');

      log('Fetching store detail for: $storeId');

      final response = await http.get(url);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        log('Got store detail: ${data['name']}');
        return data;
      } else {
        throw Exception('Failed to fetch store detail: ${response.statusCode}');
      }
    } catch (e) {
      log('Error fetching store detail: $e');
      rethrow;
    }
  }

  /// Get stores nearby - POST to /recommends/near-by
  Future<List<Store>> getStoresNearby({
    required double? latitude,
    required double? longitude,
    required String? wardName,
    required String? provinceName,
    int distance = 10000,
  }) async {
    try {
      final url = Uri.parse('$_baseUrl/recommends/near-by');

      final body = {
        'provinceName': provinceName ?? '',
      };

      log('Fetching nearby stores with: $body');

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        final stores = data.map((e) => Store.fromJson(e)).toList();
        log('Got ${stores.length} nearby stores');
        return stores;
      } else {
        throw Exception(
          'Failed to fetch nearby stores: ${response.statusCode}',
        );
      }
    } catch (e) {
      log('Error fetching nearby stores: $e');
      rethrow;
    }
  }

  /// Lấy danh sách sports/categories
  Future<dynamic> getSports() async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/sports'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Lỗi tải danh sách môn thể thao');
      }
    } catch (e) {
      throw Exception('Lỗi kết nối: $e');
    }
  }
}
