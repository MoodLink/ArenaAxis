// chat_page.dart

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/chat_controller.dart';
import 'package:mobile/widgets/loading.dart';

class ChatPage extends StatelessWidget {
  final String posterId;
  ChatPage({super.key, required this.posterId});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<ChatController>(tag: 'chat_$posterId');
    final Size screenSize = MediaQuery.of(context).size;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            // Avatar
            CircleAvatar(
              radius: 18,
              backgroundColor: Colors.grey[300],
              backgroundImage: controller.otherUserAvatar != null
                  ? NetworkImage(controller.otherUserAvatar!)
                  : null,
              child: controller.otherUserAvatar == null
                  ? const Icon(Icons.person, size: 20)
                  : null,
            ),
            const SizedBox(width: 12),
            // Name
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    controller.otherUserName ?? 'Người dùng',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  // Connection status
                  Obx(() {
                    return Text(
                      controller.isConnected.value
                          ? 'Đang hoạt động'
                          : 'Ngoại tuyến',
                      style: TextStyle(
                        fontSize: 12,
                        color: controller.isConnected.value
                            ? Colors.green
                            : Colors.grey,
                      ),
                    );
                  }),
                ],
              ),
            ),
          ],
        ),
        elevation: 1,
      ),
      body: Column(
        children: [
          // Messages list
          Expanded(
            child: Obx(() {
              // Loading state
              if (controller.isLoading.value && controller.messages.isEmpty) {
                return loadingIndicator();
              }

              // Error state
              if (controller.errorMessage.value != null &&
                  controller.messages.isEmpty) {
                return Center(
                  child: Padding(
                    padding: EdgeInsets.all(screenSize.width * 0.1),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: screenSize.width * 0.15,
                          color: Colors.red,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          controller.errorMessage.value!,
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: screenSize.width * 0.04),
                        ),
                      ],
                    ),
                  ),
                );
              }

              // Empty state
              if (controller.messages.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.chat_bubble_outline,
                        size: screenSize.width * 0.2,
                        color: Colors.grey[400],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Chưa có tin nhắn nào',
                        style: TextStyle(
                          fontSize: screenSize.width * 0.045,
                          color: Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Gửi tin nhắn để bắt đầu trò chuyện',
                        style: TextStyle(
                          fontSize: screenSize.width * 0.035,
                          color: Colors.grey[500],
                        ),
                      ),
                    ],
                  ),
                );
              }

              // Messages
              return ListView.builder(
                controller: controller.scrollController, // ✅ Attach scroll controller
                padding: EdgeInsets.all(screenSize.width * 0.04),
                reverse: false, // ✅ Normal order (old to new)
                itemCount: controller.messages.length,
                itemBuilder: (context, index) {
                  final message = controller.messages[index];
                  final isMyMessage = controller.isMyMessage(message);
                  return _buildMessageBubble(
                    message,
                    isMyMessage,
                    screenSize,
                    controller,
                  );
                },
              );
            }),
          ),

          // Input area
          Container(
            padding: EdgeInsets.symmetric(
              horizontal: screenSize.width * 0.03,
              vertical: screenSize.height * 0.01,
            ),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, -3),
                ),
              ],
            ),
            child: SafeArea(
              child: Row(
                children: [
                  // Text field
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.grey[100],
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: TextField(
                        controller: controller.messageController,
                        decoration: InputDecoration(
                          hintText: 'Nhập tin nhắn...',
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: screenSize.width * 0.04,
                            vertical: screenSize.height * 0.015,
                          ),
                        ),
                        maxLines: null,
                        textInputAction: TextInputAction.newline,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Send button
                  Obx(() {
                    return IconButton(
                      onPressed: controller.isSending.value
                          ? null
                          : controller.sendMessage,
                      icon: controller.isSending.value
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(Icons.send),
                      color: Theme.of(context).colorScheme.primary,
                      style: IconButton.styleFrom(
                        backgroundColor: Theme.of(
                          context,
                        ).colorScheme.primary.withOpacity(0.1),
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(
    dynamic message,
    bool isMyMessage,
    Size screenSize,
    ChatController controller,
  ) {
    return Padding(
      padding: EdgeInsets.only(bottom: screenSize.height * 0.01),
      child: Row(
        mainAxisAlignment: isMyMessage
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Avatar for other user
          if (!isMyMessage) ...[
            CircleAvatar(
              radius: 16,
              backgroundColor: Colors.grey[300],
              backgroundImage: controller.otherUserAvatar != null
                  ? NetworkImage(controller.otherUserAvatar!)
                  : null,
              child: controller.otherUserAvatar == null
                  ? const Icon(Icons.person, size: 16)
                  : null,
            ),
            const SizedBox(width: 8),
          ],

          // Message bubble
          Flexible(
            child: Container(
              constraints: BoxConstraints(maxWidth: screenSize.width * 0.7),
              padding: EdgeInsets.symmetric(
                horizontal: screenSize.width * 0.04,
                vertical: screenSize.height * 0.012,
              ),
              decoration: BoxDecoration(
                gradient: isMyMessage
                    ? const LinearGradient(
                        colors: [
                          Color(0xFF4CAF50), // Xanh lá
                          Color(0xFF2196F3), // Xanh dương
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      )
                    : null,
                color: isMyMessage ? null : Colors.grey[200],
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft: Radius.circular(isMyMessage ? 16 : 4),
                  bottomRight: Radius.circular(isMyMessage ? 4 : 16),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Message content
                  Text(
                    message.content,
                    style: TextStyle(
                      fontSize: screenSize.width * 0.038,
                      color: isMyMessage ? Colors.white : Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 4),
                  // Timestamp and status
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        controller.formatMessageTime(message.timestamp ),
                        style: TextStyle(
                          fontSize: screenSize.width * 0.028,
                          color: isMyMessage
                              ? Colors.white.withOpacity(0.7)
                              : Colors.grey[600],
                        ),
                      ),
                      if (isMyMessage) ...[
                        const SizedBox(width: 4),
                        Icon(
                          message.status == 'SENDING'
                              ? Icons.access_time
                              : message.status == 'SENT'
                              ? Icons.done
                              : Icons.done_all,
                          size: 14,
                          color: Colors.white.withOpacity(0.7),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Spacer for my messages
          if (isMyMessage) const SizedBox(width: 8),
        ],
      ),
    );
  }
}