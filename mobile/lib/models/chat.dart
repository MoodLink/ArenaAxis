// chat_models.dart

/// Model cho người dùng trong chat
class ChatUser {
  final String id;
  final String name;
  final String email;
  final String? avatarUrl;

  ChatUser({
    required this.id,
    required this.name,
    required this.email,
    this.avatarUrl,
  });

  factory ChatUser.fromJson(Map<String, dynamic> json) {
    return ChatUser(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? 'Unknown',
      email: json['email'] as String? ?? '',
      avatarUrl: json['avatarUrl'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'avatarUrl': avatarUrl,
    };
  }
}

/// Model cho tin nhắn
class ChatMessage {
  final String id;
  final String conversationId;
  final String senderId;
  final String content;
  final String status; // SENT, RECEIVED, READ
  final String timestamp;
  ChatUser? sender; // Optional, có thể load sau

  ChatMessage({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.content,
    required this.status,
    required this.timestamp,
    this.sender,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'] as String? ?? '',
      conversationId: json['conversationId'] as String? ?? '',
      senderId: json['senderId'] as String? ?? json['sender_id'] as String? ?? '',
      content: json['content'] as String? ?? '',
      status: json['status'] as String? ?? 'RECEIVED',
      timestamp: json['timestamp'] as String? ?? 
                 json['createdAt'] as String? ?? 
                 DateTime.now().toIso8601String(),
      sender: json['sender'] != null 
          ? ChatUser.fromJson(json['sender'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'conversationId': conversationId,
      'senderId': senderId,
      'content': content,
      'status': status,
      'timestamp': timestamp,
      if (sender != null) 'sender': sender!.toJson(),
    };
  }

  ChatMessage copyWith({
    String? id,
    String? conversationId,
    String? senderId,
    String? content,
    String? status,
    String? timestamp,
    ChatUser? sender,
  }) {
    return ChatMessage(
      id: id ?? this.id,
      conversationId: conversationId ?? this.conversationId,
      senderId: senderId ?? this.senderId,
      content: content ?? this.content,
      status: status ?? this.status,
      timestamp: timestamp ?? this.timestamp,
      sender: sender ?? this.sender,
    );
  }
}

/// Model cho conversation/chat room
class ChatRoom {
  final String id;
  final String name;
  final String? avatarUrl;
  final ChatMessage? lastMessage;
  final int unreadCount;
  final String? lastMessageTime;
  final String? otherUserId; // ID của người còn lại trong conversation

  ChatRoom({
    required this.id,
    required this.name,
    this.avatarUrl,
    this.lastMessage,
    this.unreadCount = 0,
    this.lastMessageTime,
    this.otherUserId,
  });

  factory ChatRoom.fromJson(Map<String, dynamic> json) {
    return ChatRoom(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? 'Unknown',
      avatarUrl: json['avatarUrl'] as String?,
      lastMessage: json['lastMessage'] != null
          ? ChatMessage.fromJson(json['lastMessage'] as Map<String, dynamic>)
          : null,
      unreadCount: json['unreadCount'] as int? ?? 0,
      lastMessageTime: json['lastMessageTime'] as String?,
      otherUserId: json['otherUserId'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'avatarUrl': avatarUrl,
      'lastMessage': lastMessage?.toJson(),
      'unreadCount': unreadCount,
      'lastMessageTime': lastMessageTime,
      'otherUserId': otherUserId,
    };
  }
}

/// WebSocket message types
enum WebSocketMessageType {
  register,
  messageSend,
  messageReceive,
  messageSendAck,
  postApply,
  messageApply,
  ping,
  pong,
  unknown,
}

/// WebSocket message wrapper
class WebSocketMessage {
  final WebSocketMessageType type;
  final Map<String, dynamic> data;

  WebSocketMessage({
    required this.type,
    required this.data,
  });

  factory WebSocketMessage.fromJson(Map<String, dynamic> json) {
    final typeStr = json['type'] as String? ?? '';
    WebSocketMessageType messageType;

    switch (typeStr) {
      case 'register':
        messageType = WebSocketMessageType.register;
        break;
      case 'message.send':
        messageType = WebSocketMessageType.messageSend;
        break;
      case 'message.receive':
        messageType = WebSocketMessageType.messageReceive;
        break;
      case 'message.send.ack':
        messageType = WebSocketMessageType.messageSendAck;
        break;
      case 'post.apply':
        messageType = WebSocketMessageType.postApply;
        break;
      case 'message.apply':
        messageType = WebSocketMessageType.messageApply;
        break;
      case 'ping':
        messageType = WebSocketMessageType.ping;
        break;
      case 'pong':
        messageType = WebSocketMessageType.pong;
        break;
      default:
        messageType = WebSocketMessageType.unknown;
    }

    return WebSocketMessage(
      type: messageType,
      data: json['data'] as Map<String, dynamic>? ?? {},
    );
  }

  Map<String, dynamic> toJson() {
    String typeStr;
    switch (type) {
      case WebSocketMessageType.register:
        typeStr = 'register';
        break;
      case WebSocketMessageType.messageSend:
        typeStr = 'message.send';
        break;
      case WebSocketMessageType.messageReceive:
        typeStr = 'message.receive';
        break;
      case WebSocketMessageType.messageSendAck:
        typeStr = 'message.send.ack';
        break;
      case WebSocketMessageType.postApply:
        typeStr = 'post.apply';
        break;
      case WebSocketMessageType.messageApply:
        typeStr = 'message.apply';
        break;
      case WebSocketMessageType.ping:
        typeStr = 'ping';
        break;
      case WebSocketMessageType.pong:
        typeStr = 'pong';
        break;
      default:
        typeStr = 'unknown';
    }

    return {
      'type': typeStr,
      'data': data,
    };
  }
}