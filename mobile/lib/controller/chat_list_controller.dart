// chat_list_controller.dart

import 'dart:developer' as dev;
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/services/chat_service.dart';
import 'package:mobile/utilities/token_storage.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ChatListController extends GetxController {
  final ChatService _chatService = ChatService();
  final tokenStorage = TokenStorage(storage: const FlutterSecureStorage());

  // Observable states
  final conversations = <Map<String, dynamic>>[].obs;
  final isLoading = false.obs;
  final errorMessage = Rxn<String>();
  final searchQuery = ''.obs;

  String? currentUserId;

  // Text controller for search
  final TextEditingController searchController = TextEditingController();

  @override
  void onInit() {
    super.onInit();
    _initialize();
    
    // Listen to search changes
    searchController.addListener(() {
      searchQuery.value = searchController.text;
      if (searchController.text.isEmpty) {
        loadConversations();
      }
    });
  }

  Future<void> _initialize() async {
    try {
      final user = await tokenStorage.getUserData();
      if (user == null) {
        errorMessage.value = 'Không tìm thấy thông tin người dùng';
        dev.log('❌ No user data found');
        return;
      }
      currentUserId = user.id;
      dev.log('✅ Current user ID: $currentUserId');
      
      await loadConversations();
    } catch (e) {
      dev.log('❌ Error initializing chat list: $e');
      errorMessage.value = 'Lỗi khởi tạo: $e';
    }
  }

  /// Load conversations
  Future<void> loadConversations({String? receiverName}) async {
    User? user = await tokenStorage.getUserData();
    currentUserId = user?.id;
    if (currentUserId == null) {
      errorMessage.value = 'Chưa đăng nhập';
      return;
    }

    try {
      isLoading.value = true;
      errorMessage.value = null;

      final result = await _chatService.getConversations(
        userId: currentUserId!,
        receiverName: receiverName,
        page: 0,
        perPage: 100,
      );

      if (result['success'] == true) {
        final List<dynamic> data = result['data'] as List<dynamic>;
        final conversationList = data
            .map((item) => item as Map<String, dynamic>)
            .toList();
        
        // Sort by lastMessageAt (most recent first)
        conversationList.sort((a, b) {
          final aTime = a['lastMessageAt'] as String?;
          final bTime = b['lastMessageAt'] as String?;
          
          if (aTime == null && bTime == null) return 0;
          if (aTime == null) return 1;
          if (bTime == null) return -1;
          
          try {
            final aDateTime = _parseTimestamp(aTime);
            final bDateTime = _parseTimestamp(bTime);
            
            // Most recent first (descending order)
            return bDateTime.compareTo(aDateTime);
          } catch (e) {
            dev.log('❌ Error sorting conversations: $e');
            return 0;
          }
        });
        
        conversations.value = conversationList;

        dev.log('✅ Loaded ${conversations.length} conversations (sorted)');
      } else {
        errorMessage.value = result['error'] as String?;
        dev.log('❌ Load conversations failed: ${result['error']}');
      }
    } catch (e) {
      dev.log('❌ Error loading conversations: $e');
      errorMessage.value = 'Lỗi tải danh sách chat: $e';
    } finally {
      isLoading.value = false;
    }
  }

  /// Search conversations by receiver name
  Future<void> searchConversations(String query) async {
    if (query.trim().isEmpty) {
      await loadConversations();
    } else {
      await loadConversations(receiverName: query.trim());
    }
  }

  /// Refresh conversations
  Future<void> refreshConversations() async {
    searchController.clear();
    await loadConversations();
  }

  /// Get other user from conversation participants
  Map<String, dynamic>? getOtherUser(Map<String, dynamic> conversation) {
    final participants = conversation['participants'] as List<dynamic>?;
    if (participants == null || participants.isEmpty) return null;

    for (var participant in participants) {
      final p = participant as Map<String, dynamic>;
      if (p['id'] != currentUserId) {
        return p;
      }
    }
    return null;
  }

  /// Format last message time
  String formatLastMessageTime(String? timestamp) {
    if (timestamp == null || timestamp.isEmpty) return '';

    try {
      final dateTime = _parseTimestamp(timestamp);
      final now = DateTime.now();
      final difference = now.difference(dateTime);

      if (difference.inDays == 0) {
        // Today - show time
        final timeParts = timestamp.split(' ')[0].split(':');
        return '${timeParts[0]}:${timeParts[1]}';
      } else if (difference.inDays == 1) {
        return 'Hôm qua';
      } else if (difference.inDays < 7) {
        return '${difference.inDays} ngày trước';
      } else {
        final dateParts = timestamp.split(' ')[1].split('/');
        return '${dateParts[0]}/${dateParts[1]}/${dateParts[2]}';
      }
    } catch (e) {
      dev.log('❌ Error parsing timestamp "$timestamp": $e');
      return timestamp;
    }
  }

  /// Parse timestamp string to DateTime
  DateTime _parseTimestamp(String timestamp) {
    // Parse format: "HH:mm:ss dd/MM/yyyy"
    final parts = timestamp.split(' ');
    if (parts.length != 2) throw FormatException('Invalid timestamp format');

    final timeParts = parts[0].split(':');
    final dateParts = parts[1].split('/');

    if (timeParts.length != 3 || dateParts.length != 3) {
      throw FormatException('Invalid timestamp format');
    }

    return DateTime(
      int.parse(dateParts[2]), // year
      int.parse(dateParts[1]), // month
      int.parse(dateParts[0]), // day
      int.parse(timeParts[0]), // hour
      int.parse(timeParts[1]), // minute
      int.parse(timeParts[2]), // second
    );
  }

  /// Get last message preview
  String getLastMessagePreview(Map<String, dynamic>? lastMessage) {
    if (lastMessage == null) return 'Chưa có tin nhắn';

    final content = lastMessage['content'] as String?;
    if (content == null || content.isEmpty) return 'Tin nhắn mới';

    // Truncate if too long
    if (content.length > 50) {
      return '${content.substring(0, 50)}...';
    }
    return content;
  }

  /// Check if conversation has unread messages
  bool hasUnreadMessages(Map<String, dynamic> conversation) {
    final seen = conversation['seen'] as bool?;
    final lastMessage = conversation['lastMessage'] as Map<String, dynamic>?;
    
    // If seen is false and last message is from other user
    if (seen == false && lastMessage != null) {
      final senderId = lastMessage['senderId'] as String?;
      return senderId != currentUserId;
    }
    
    return false;
  }

  @override
  void onClose() {
    searchController.dispose();
    super.onClose();
  }
}