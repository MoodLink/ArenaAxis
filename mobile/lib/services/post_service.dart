import 'dart:developer';
import 'package:http/http.dart' as http;
import 'dart:convert';

class PostService {
  static const String baseUrl = 'https://www.executexan.store';

  /// Lấy danh sách sports/categories
  Future<dynamic> getSports() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/sports'),
        headers: {
          'Content-Type': 'application/json',
        },
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

  /// Lấy danh sách các trận đấu có thể tuyển người chơi từ một order
  Future<dynamic> getMatchesByOrder(String orderId, String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/matches/order/$orderId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      log('url: ${'$baseUrl/matches/order/$orderId'}');
      
      if (response.statusCode == 200) {

        return json.decode(response.body);
      } else {
        try {
          final errorBody = json.decode(response.body);
          if (errorBody.containsKey('message')) {
            throw Exception('Lỗi tải danh sách trận đấu: ${errorBody['message']}');
          }
        } catch (_) {}
        throw Exception('Lỗi tải danh sách trận đấu: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Lỗi kết nối: $e');
    }
  }

  /// Tạo post tuyển người chơi
  Future<Map<String, dynamic>> createPost({
    required List<String> matchIds,
    required String title,
    required String description,
    required int requiredNumber,
    required int currentNumber,
    required String userId,
    required String token,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/posts'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'matchIds': matchIds,
          'title': title,
          'description': description,
          'requiredNumber': requiredNumber,
          'currentNumber': currentNumber,
          'userId': userId,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        try {
          final errorBody = json.decode(response.body);
          if (errorBody.containsKey('message')) {
            throw Exception('Lỗi tạo bài đăng: ${errorBody['message']}');
          }
        } catch (_) {}
        throw Exception('Lỗi tạo bài đăng: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Lỗi kết nối: $e');
    }
  }

  /// Tìm kiếm posts từ cộng đồng (không bao gồm posts của user hiện tại)
  Future<Map<String, dynamic>> searchPosts({
    int page = 0,
    int perPage = 12,
    String? storeName,
    String? fromDate,
    String? toDate,
    String? provinceId,
    String? wardId,
    String? sportId,
    String? token,
  }) async {
    try {
      // Build request body - chỉ thêm các field có giá trị
      final Map<String, dynamic> body = {};
      
      if (storeName != null && storeName.isNotEmpty) {
        body['storeName'] = storeName;
      }
      if (fromDate != null && fromDate.isNotEmpty) {
        body['fromDate'] = fromDate;
      }
      if (toDate != null && toDate.isNotEmpty) {
        body['toDate'] = toDate;
      }
      if (provinceId != null && provinceId.isNotEmpty) {
        body['provinceId'] = provinceId;
      }
      if (wardId != null && wardId.isNotEmpty) {
        body['wardId'] = wardId;
      }
      if (sportId != null && sportId.isNotEmpty) {
        body['sportId'] = sportId;
      }

      final response = await http.post(
        Uri.parse('$baseUrl/posts/search?page=$page&perPage=$perPage'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode(body),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {
          'data': data,
          'page': page,
          'perPage': perPage,
        };
      } else {
        try {
          final errorBody = json.decode(response.body);
          if (errorBody.containsKey('message')) {
            throw Exception('Lỗi tìm kiếm: ${errorBody['message']}');
          }
        } catch (_) {}
        throw Exception('Lỗi tìm kiếm: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Lỗi kết nối: $e');
    }
  }

  /// Lấy danh sách posts của user hiện tại
  Future<Map<String, dynamic>> getMyPosts({
    required String userId,
    int page = 0,
    int perPage = 12,
    String? token,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/posts/poster/$userId?page=$page&perPage=$perPage'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        return {
          'data': data,
          'page': page,
          'perPage': perPage,
        };
      } else {
        try {
          final errorBody = json.decode(response.body);
          if (errorBody.containsKey('message')) {
            throw Exception('Lỗi tải bài đăng: ${errorBody['message']}');
          }
        } catch (_) {}
        throw Exception('Lỗi tải bài đăng: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Lỗi kết nối: $e');
    }
  }

  /// Lấy chi tiết một post
  Future<Map<String, dynamic>> getPostById(String postId, {String? token}) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/posts/$postId'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Lỗi tải chi tiết bài đăng');
      }
    } catch (e) {
      throw Exception('Lỗi kết nối: $e');
    }
  }

  /// Tham gia một post
  Future<void> joinPost({
    required String postId,
    required String userId,
    String? token,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/posts/$postId/join'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'userId': userId,
        }),
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        try {
          final errorBody = json.decode(response.body);
          if (errorBody.containsKey('message')) {
            throw Exception('Lỗi tham gia: ${errorBody['message']}');
          }
        } catch (_) {}
        throw Exception('Lỗi tham gia: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Lỗi kết nối: $e');
    }
  }
}