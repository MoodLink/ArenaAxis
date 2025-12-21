// chat_service.dart
import 'dart:developer';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:mobile/utilities/token_storage.dart';


class ChatService {
  static const String baseUrl = 'https://www.executexan.store';
  final tokenStorage = TokenStorage(storage: const FlutterSecureStorage());

  /// Lấy danh sách conversations
  Future<Map<String, dynamic>> getConversations({
    required String userId,
    String? receiverName,
    int page = 0,
    int perPage = 20,
  }) async {
    try {
      final queryParams = {
        'userId': userId,
        'page': page.toString(),
        'perPage': perPage.toString(),
        if (receiverName != null && receiverName.isNotEmpty)
          'receiverName': receiverName,
      };

      final uri = Uri.parse('$baseUrl/conversations')
          .replace(queryParameters: queryParams);
      log('Fetching conversations from: $uri');
      
      // Get token
      final token = await tokenStorage.getAccessToken();
      
      final response = await http.get(
        uri,
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );



      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        // API returns array directly
        return {
          'success': true,
          'data': data is List ? data : [],
        };
      } else {
        return {
          'success': false,
          'error': 'Lỗi tải danh sách chat: ${response.statusCode}',
        };
      }
    } catch (e) {
      log('❌ Error in getConversations: $e');
      return {
        'success': false,
        'error': 'Lỗi kết nối: $e',
      };
    }
  }

  /// Lấy tin nhắn của một conversation
  Future<Map<String, dynamic>> getMessages({
    required String conversationId,
    int page = 0,
    int perPage = 1000,
  }) async {
    try {
      final queryParams = {
        'conversationId': conversationId,
        'page': page.toString(),
        'perPage': perPage.toString(),
      };

      final uri = Uri.parse('$baseUrl/messages')
          .replace(queryParameters: queryParams);

      log('Fetching messages from: $uri');
      final response = await http.get(
        uri,
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        log('Messages response: $data');
        // API trả về array trực tiếp, không có wrapper 'data'
        return {
          'success': true,
          'data': data is List ? data : [],
        };
      } else {
        log('Error loading messages: ${response.statusCode}');
        return {
          'success': false,
          'error': 'Lỗi tải tin nhắn: ${response.statusCode}',
        };
      }
    } catch (e) {
      log('Exception loading messages: $e');
      return {
        'success': false,
        'error': 'Lỗi kết nối: $e',
      };
    }
  }

  /// Đánh dấu tin nhắn đã đọc
  Future<Map<String, dynamic>> markAsRead({
    required String conversationId,
    required String userId,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/messages/read'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'conversationId': conversationId,
          'userId': userId,
        }),
      );

      if (response.statusCode == 200) {
        return {
          'success': true,
        };
      } else {
        return {
          'success': false,
          'error': 'Lỗi đánh dấu đã đọc: ${response.statusCode}',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'error': 'Lỗi kết nối: $e',
      };
    }
  }
}