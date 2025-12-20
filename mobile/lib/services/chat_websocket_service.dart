// chat_websocket_service.dart

import 'dart:async';
import 'dart:convert';
import 'dart:developer' as dev;
import 'package:mobile/models/chat.dart';
import 'package:web_socket_channel/web_socket_channel.dart';


class ChatWebSocketService {
  static final ChatWebSocketService _instance = ChatWebSocketService._internal();
  factory ChatWebSocketService() => _instance;
  ChatWebSocketService._internal();

  WebSocketChannel? _channel;
  bool _isConnected = false;
  String? _userId;
  Timer? _heartbeatTimer;
  Timer? _reconnectTimer;
  int _reconnectAttempts = 0;
  static const int _maxReconnectAttempts = 5;
  static const int _reconnectDelay = 3000; // milliseconds
  bool _isRegistered = false;

  // Stream controllers
  final _messageStreamController = StreamController<ChatMessage>.broadcast();
  final _connectionStreamController = StreamController<bool>.broadcast();
  final _ackStreamController = StreamController<Map<String, dynamic>>.broadcast();

  // Getters
  Stream<ChatMessage> get messageStream => _messageStreamController.stream;
  Stream<bool> get connectionStream => _connectionStreamController.stream;
  Stream<Map<String, dynamic>> get ackStream => _ackStreamController.stream;
  bool get isConnected => _isConnected;

  /// Kết nối WebSocket
  Future<void> connect(String userId, String token) async {
    if (_isConnected && _channel != null) {
      dev.log('WebSocket already connected');
      return;
    }

    _userId = userId;
    
    try {
      final wsUrl = Uri.parse('ws://www.executexan.store/ws/messages?token=$token');
      dev.log('Connecting to WebSocket: $wsUrl');

      _channel = WebSocketChannel.connect(wsUrl);
      
      // Lắng nghe messages
      _channel!.stream.listen(
        _handleMessage,
        onError: _handleError,
        onDone: _handleDisconnect,
      );
    
      _isConnected = true;
      _reconnectAttempts = 0;
      _connectionStreamController.add(true);
      
      dev.log('✅ WebSocket connected');

      // Gửi register message
      _sendRegister();

      // Bắt đầu heartbeat
      _startHeartbeat();

    } catch (e) {
      dev.log('❌ Error connecting to WebSocket: $e');
      _isConnected = false;
      _connectionStreamController.add(false);
      _scheduleReconnect();
    }
  }

  /// Xử lý tin nhắn từ server
  void _handleMessage(dynamic data) {
    try {
      dev.log('📨 [RAW] Received: $data');
      final json = jsonDecode(data as String) as Map<String, dynamic>;
      final wsMessage = WebSocketMessage.fromJson(json);

      switch (wsMessage.type) {
        case WebSocketMessageType.messageReceive:
          _handleIncomingMessage(wsMessage.data);
          break;

        case WebSocketMessageType.messageSendAck:
          _handleAck(wsMessage.data);
          break;

        case WebSocketMessageType.messageApply:
        case WebSocketMessageType.postApply:
          // TODO: Handle post apply notifications
          dev.log('🎯 Post apply notification received');
          break;

        case WebSocketMessageType.pong:
          dev.log('💓 Pong received');
          break;

        case WebSocketMessageType.ping:
          dev.log('💓 Ping received, sending pong');
          _sendPong();
          break;

        default:
          // Handle legacy format (old messages without type)
          if (json.containsKey('senderId') && json.containsKey('content')) {
            _handleLegacyMessage(json);
          } else {
            dev.log('⚠️ Unknown message type: ${wsMessage.type}');
          }
      }
    } catch (e) {
      dev.log('❌ Error parsing message: $e');
    }
  }

  /// Xử lý tin nhắn đến (format mới)
  void _handleIncomingMessage(Map<String, dynamic> data) {
    try {
      final sender = ChatUser.fromJson(data['sender'] as Map<String, dynamic>);
      final content = data['content'] as String;
      final conversationId = data['conversationId'] as String;
      final status = data['status'] as String? ?? 'RECEIVED';
      final timestamp = data['timestamp'] as String? ?? DateTime.now().toIso8601String();

      final message = ChatMessage(
        id: '${DateTime.now().millisecondsSinceEpoch}',
        conversationId: conversationId,
        senderId: sender.id,
        content: content,
        status: status,
        timestamp: timestamp,
        sender: sender,
      );

      dev.log('📩 [message.receive] From: ${sender.name}');
      _messageStreamController.add(message);
    } catch (e) {
      dev.log('❌ Error handling incoming message: $e');
    }
  }

  /// Xử lý ACK (xác nhận gửi tin nhắn)
  void _handleAck(Map<String, dynamic> data) {
    dev.log('✅ [message.send.ack] Status: ${data['status']}');
    _ackStreamController.add(data);
  }

  /// Xử lý tin nhắn legacy (format cũ)
  void _handleLegacyMessage(Map<String, dynamic> json) {
    try {
      dev.log('📩 [OLD FORMAT] Converting legacy message...');
      
      final message = ChatMessage(
        id: json['id'] as String? ?? '${DateTime.now().millisecondsSinceEpoch}',
        conversationId: json['conversationId'] as String? ?? 'unknown',
        senderId: json['senderId'] as String,
        content: json['content'] as String,
        status: json['status'] as String? ?? 'RECEIVED',
        timestamp: json['timestamp'] as String? ?? DateTime.now().toIso8601String(),
      );

      _messageStreamController.add(message);
    } catch (e) {
      dev.log('❌ Error handling legacy message: $e');
    }
  }

  /// Xử lý lỗi
  void _handleError(dynamic error) {
    dev.log('❌ WebSocket error: $error');
    _isConnected = false;
    _connectionStreamController.add(false);
  }

  /// Xử lý ngắt kết nối
  void _handleDisconnect() {
    dev.log('🔌 WebSocket disconnected');
    _isConnected = false;
    _isRegistered = false;
    _connectionStreamController.add(false);
    _heartbeatTimer?.cancel();
    
    // Thử reconnect
    _scheduleReconnect();
  }

  /// Lên lịch reconnect
  void _scheduleReconnect() {
    if (_reconnectAttempts >= _maxReconnectAttempts) {
      dev.log('⚠️ Max reconnect attempts reached');
      return;
    }

    _reconnectAttempts++;
    dev.log('🔄 Scheduling reconnect (attempt $_reconnectAttempts/$_maxReconnectAttempts)...');
    
    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(Duration(milliseconds: _reconnectDelay), () {
      if (_userId != null) {
        // Note: Need to get token again from storage
        // This is a simplified version
        dev.log('🔄 Attempting to reconnect...');
        // connect(_userId!, token); // TODO: Get token from storage
      }
    });
  }

  /// Gửi register message
  void _sendRegister() {
    if (_isRegistered || _userId == null) return;

    final message = {
      'type': 'register',
      'userId': _userId,
    };

    _sendRaw(message);
    _isRegistered = true;
    dev.log('📝 Register message sent for user: $_userId');
  }

  /// Bắt đầu heartbeat
  void _startHeartbeat() {
    _heartbeatTimer?.cancel();
    _heartbeatTimer = Timer.periodic(const Duration(seconds: 10), (timer) {
      if (_isConnected && _channel != null) {
        _sendRaw({'type': 'ping'});

      }
    });
  }

  /// Gửi pong
  void _sendPong() {
    _sendRaw({'type': 'pong'});
  }

  /// Gửi tin nhắn
  bool sendMessage(String receiverId, String content, {String? conversationId}) {
    if (!_isConnected || _channel == null) {
      dev.log('❌ Cannot send message: WebSocket not connected');
      return false;
    }

    if (_userId == null) {
      dev.log('❌ Cannot send message: User ID not set');
      return false;
    }

    if (content.trim().isEmpty) {
      dev.log('❌ Cannot send message: Content is empty');
      return false;
    }

    try {
      final message = {
        'type': 'message.send',
        'data': {
          'senderId': _userId,
          'receiverId': receiverId,
          'content': content,
        }
      };

      _sendRaw(message);
      dev.log('✉️ Message sent to $receiverId');
      return true;
    } catch (e) {
      dev.log('❌ Error sending message: $e');
      return false;
    }
  }

  /// Gửi dữ liệu raw
  void _sendRaw(Map<String, dynamic> data) {
    if (_channel != null && _isConnected) {
      final jsonStr = jsonEncode(data);
      _channel!.sink.add(jsonStr);
    }
  }

  /// Ngắt kết nối
  void disconnect() {
    dev.log('🔌 Disconnecting WebSocket...');
    _heartbeatTimer?.cancel();
    _reconnectTimer?.cancel();
    _channel?.sink.close();
    _channel = null;
    _isConnected = false;
    _isRegistered = false;
    _userId = null;
    _connectionStreamController.add(false);
  }

  /// Cleanup
  void dispose() {
    disconnect();
    _messageStreamController.close();
    _connectionStreamController.close();
    _ackStreamController.close();
  }
}