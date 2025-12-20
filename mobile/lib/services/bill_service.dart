import 'package:http/http.dart' as http;
import 'dart:convert';

class BookingsService {
  static const String baseUrl = 'http://www.executexan.store';
  static const String userServiceUrl = 'http://www.executexan.store';

Future<Map<String, dynamic>> getOrderById(String orderId) async {
  try {
    final response = await http.get(
      Uri.parse('$baseUrl/api/v1/orders/$orderId'),
      headers: {
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      try {
        final errorBody = json.decode(response.body);
        if (errorBody.containsKey('message')) {
          throw Exception('Lỗi tải chi tiết đơn: ${errorBody['message']}');
        }
      } catch (_) {}
      throw Exception('Lỗi tải chi tiết đơn: ${response.statusCode}');
    }
  } catch (e) {
    throw Exception('Lỗi kết nối: $e');
  }
}

  /// Lấy danh sách orders của user
  Future<Map<String, dynamic>> getUserOrders(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/orders/user/$userId'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        try {
          final errorBody = json.decode(response.body);
          if (errorBody.containsKey('message')) {
            throw Exception('Lỗi tải dữ liệu: ${errorBody['message']}');
          }
        } catch (_) {}
        throw Exception('Lỗi tải dữ liệu: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Lỗi kết nối: $e');
    }
  }

  /// Lấy thông tin chi tiết store
  Future<Map<String, dynamic>> getStoreDetail(String storeId) async {
    try {
      final response = await http.get(
        Uri.parse('$userServiceUrl/stores/detail/$storeId'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Lỗi tải thông tin cửa hàng');
      }
    } catch (e) {
      throw Exception('Lỗi kết nối: $e');
    }
  }

  /// Lấy thông tin chi tiết field
  Future<Map<String, dynamic>> getFieldDetail(String fieldId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/fields/$fieldId'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Lỗi tải thông tin sân');
      }
    } catch (e) {
      throw Exception('Lỗi kết nối: $e');
    }
  }

  /// Hủy đơn đặt sân
  Future<Map<String, dynamic>> cancelOrder(String orderId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/api/v1/orders/$orderId'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        try {
          final errorBody = json.decode(response.body);
          if (errorBody.containsKey('message')) {
            throw Exception('Lỗi hủy đơn: ${errorBody['message']}');
          }
        } catch (_) {}
        throw Exception('Lỗi hủy đơn: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Lỗi kết nối: $e');
    }
  }

  /// Thanh toán đơn
  Future<Map<String, dynamic>> payOrder(String orderId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/orders/$orderId/payment'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        try {
          final errorBody = json.decode(response.body);
          if (errorBody.containsKey('message')) {
            throw Exception('Lỗi thanh toán: ${errorBody['message']}');
          }
        } catch (_) {}
        throw Exception('Lỗi thanh toán: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Lỗi kết nối: $e');
    }
  }
}