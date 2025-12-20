// chat_controller.dart

import 'dart:developer' as dev;
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/models/chat.dart';
import 'package:mobile/services/chat_service.dart';
import 'package:mobile/services/chat_websocket_service.dart';
import 'package:mobile/utilities/token_storage.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';

class ChatController extends GetxController {
  final ChatService _chatService = ChatService();
  final ChatWebSocketService _wsService = ChatWebSocketService();
  final tokenStorage = TokenStorage(storage: const FlutterSecureStorage());

  // Observable states
  final messages = <ChatMessage>[].obs;
  final isLoading = false.obs;
  final isSending = false.obs;
  final isConnected = false.obs;
  final errorMessage = Rxn<String>();

  // Chat info
  String? conversationId;
  String? currentUserId;
  String? otherUserId;
  String? otherUserName;
  String? otherUserAvatar;

  final TextEditingController messageController = TextEditingController();

  @override
  void onInit() {
    super.onInit();
    // Don't call _initializeChat here if using direct data setting
    // It will be called manually via initializeChatWithData()
  }

  /// Initialize chat with data already set (called from outside)
  Future<void> initializeChatWithData() async {
    try {
      // Lấy user hiện tại
      final user = await tokenStorage.getUserData();
      if (user == null) {
        errorMessage.value = 'Không tìm thấy thông tin người dùng';
        dev.log('❌ No user data found');
        return;
      }
      currentUserId = user.id;
      dev.log('✅ Current user ID: $currentUserId');

      // Data already set from outside
      dev.log('👤 Other user info (from direct setting):');
      dev.log('  - ID: $otherUserId');
      dev.log('  - Name: $otherUserName');
      dev.log('  - Avatar: $otherUserAvatar');

      if (otherUserId == null || otherUserId!.isEmpty) {
        errorMessage.value = 'Thiếu ID người nhận';
        dev.log('❌ Other user ID is null or empty');
        return;
      }

      // Kết nối WebSocket
      await _connectWebSocket();

      // Load conversation và messages
      await _loadConversation();

      // Lắng nghe tin nhắn mới từ WebSocket
      _wsService.messageStream.listen(_handleNewMessage);
      _wsService.connectionStream.listen(_handleConnectionChange);

    } catch (e) {
      dev.log('❌ Error initializing chat: $e');
      errorMessage.value = 'Lỗi khởi tạo chat: $e';
    }
  }

  /// Kết nối WebSocket
  Future<void> _connectWebSocket() async {
    try {
      final token = await tokenStorage.getAccessToken();
      if (token == null || currentUserId == null) {
        dev.log('❌ No token or user ID available');
        return;
      }

      await _wsService.connect(currentUserId!, token);
      dev.log('✅ WebSocket connected');
    } catch (e) {
      dev.log('❌ Error connecting WebSocket: $e');
    }
  }

  /// Load conversation và messages
  Future<void> _loadConversation() async {
    if (conversationId == null) {
      conversationId = "efb38fc8-c681-49ba-a99d-eb58e20f4567";
      await _loadMessages();
    }

    if (conversationId != null) {
      await _loadMessages();
    }
  }



  /// Load messages
  Future<void> _loadMessages() async {
    if (conversationId == null) return;
  
    try {
      isLoading.value = true;
      errorMessage.value = null;

      final result = await _chatService.getMessages(
        conversationId: conversationId!,
      );

      if (result['success'] == true) {
        final List<dynamic> data = result['data'] as List<dynamic>;
        dev.log('📦 Raw messages data: $data');
        
        messages.value = data
            .map((json) => ChatMessage.fromJson(json as Map<String, dynamic>))
            .toList();

        dev.log('✅ Loaded ${messages.length} messages');
      } else {
        errorMessage.value = result['error'] as String?;
        dev.log('❌ Load messages failed: ${result['error']}');
      }
    } catch (e) {
      dev.log('❌ Error loading messages: $e');
      errorMessage.value = 'Lỗi tải tin nhắn: $e';
    } finally {
      isLoading.value = false;
    }
  }

  /// Xử lý tin nhắn mới từ WebSocket
  void _handleNewMessage(ChatMessage message) {
    // Chỉ thêm tin nhắn nếu thuộc conversation hiện tại
    if (message.conversationId == conversationId) {
      // Kiểm tra không trùng lặp
      if (!messages.any((m) => m.id == message.id)) {
        messages.add(message);
        dev.log('✅ New message added: ${message.content}');
      }
    }
  }

  /// Xử lý thay đổi connection
  void _handleConnectionChange(bool connected) {
    isConnected.value = connected;
    dev.log('🔌 Connection status: $connected');
  }

  /// Gửi tin nhắn
  Future<void> sendMessage() async {
    final content = messageController.text.trim();
    
    if (content.isEmpty) {
      Get.snackbar(
        'Lỗi',
        'Vui lòng nhập nội dung tin nhắn',
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }
    dev.log('✉️ Sending message to: $otherUserId');
    if (otherUserId == null) {
      Get.snackbar(
        'Lỗi',
        'Không tìm thấy thông tin người nhận',
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    try {
      isSending.value = true;

      // Tạo tin nhắn tạm thời để hiển thị ngay
      final tempMessage = ChatMessage(
        id: 'temp_${DateTime.now().millisecondsSinceEpoch}',
        conversationId: conversationId ?? 'temp',
        senderId: currentUserId ?? '',
        content: content,
        status: 'SENDING',
        timestamp: DateTime.now().toIso8601String(),
      );

      messages.add(tempMessage);
      messageController.clear();

      // Gửi qua WebSocket
      final success = _wsService.sendMessage(
        otherUserId!,
        content,
        conversationId: conversationId,
      );

      if (success) {
        dev.log('✅ Message sent successfully');
        
        // Cập nhật status sau 1 giây (giả lập ACK)
        Future.delayed(const Duration(seconds: 1), () {
          final index = messages.indexWhere((m) => m.id == tempMessage.id);
          if (index != -1) {
            messages[index] = tempMessage.copyWith(
              status: 'SENT',
              id: '${DateTime.now().millisecondsSinceEpoch}',
            );
          }
        });
      } else {
        // Xóa tin nhắn tạm nếu gửi thất bại
        messages.removeWhere((m) => m.id == tempMessage.id);
        
        Get.snackbar(
          'Lỗi',
          'Không thể gửi tin nhắn. Vui lòng thử lại.',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      dev.log('❌ Error sending message: $e');
      Get.snackbar(
        'Lỗi',
        'Lỗi gửi tin nhắn: $e',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isSending.value = false;
    }
  }

  /// Format thời gian - Xử lý cả 2 format: "HH:mm:ss dd/MM/yyyy" và ISO 8601
  String formatMessageTime(String timestamp) {
    try {
      DateTime dateTime;
      
      // Thử parse format từ API: "08:36:20 13/12/2025"
      if (timestamp.contains(' ') && timestamp.contains(':')) {
        try {
          final formatter = DateFormat('HH:mm:ss dd/MM/yyyy');
          dateTime = formatter.parse(timestamp);
        } catch (e) {
          // Nếu không parse được, thử ISO 8601
          dateTime = DateTime.parse(timestamp);
        }
      } else {
        // Format ISO 8601
        dateTime = DateTime.parse(timestamp);
      }
      
      final now = DateTime.now();
      final difference = now.difference(dateTime);

      if (difference.inDays == 0) {
        // Hôm nay - chỉ hiển thị giờ
        return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
      } else if (difference.inDays == 1) {
        return 'Hôm qua';
      } else if (difference.inDays < 7) {
        return '${difference.inDays} ngày trước';
      } else {
        return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
      }
    } catch (e) {
      dev.log('❌ Error parsing timestamp "$timestamp": $e');
      return '';
    }
  }

  /// Kiểm tra xem tin nhắn có phải của mình không
  bool isMyMessage(ChatMessage message) {
    return message.senderId == currentUserId;
  }

  @override
  void onClose() {
    messageController.dispose();
    // Không disconnect WebSocket ở đây để có thể nhận tin nhắn ở background
    super.onClose();
  }
}