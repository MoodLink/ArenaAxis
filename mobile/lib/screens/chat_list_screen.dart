// chat_list_screen.dart

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/chat_list_controller.dart';
import 'package:mobile/controller/chat_controller.dart';
import 'package:mobile/screens/chat_screen.dart';
import 'package:mobile/widgets/loading.dart';

class ChatListScreen extends StatelessWidget {
  const ChatListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<ChatListController>();
    final Size screenSize = MediaQuery.of(context).size;
    controller.loadConversations();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tin nhắn'),
        centerTitle: true,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Search bar
          Container(
            padding: EdgeInsets.all(screenSize.width * 0.04),
            color: Theme.of(context).scaffoldBackgroundColor,
            child: TextField(
              controller: controller.searchController,
              decoration: InputDecoration(
                hintText: 'Tìm kiếm cuộc trò chuyện...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: Obx(() {
                  if (controller.searchQuery.value.isNotEmpty) {
                    return IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        controller.searchController.clear();
                      },
                    );
                  }
                  return const SizedBox.shrink();
                }),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(
                    color: Theme.of(context).primaryColor,
                    width: 2,
                  ),
                ),
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
              ),
              onSubmitted: (value) {
                controller.searchConversations(value);
              },
            ),
          ),

          // Conversations list
          Expanded(
            child: Obx(() {
              // Loading state
              if (controller.isLoading.value &&
                  controller.conversations.isEmpty) {
                return loadingIndicator();
              }

              // Error state
              if (controller.errorMessage.value != null &&
                  controller.conversations.isEmpty) {
                return _buildErrorState(controller, screenSize);
              }

              // Empty state
              if (controller.conversations.isEmpty) {
                return _buildEmptyState(controller, screenSize);
              }

              // Conversations list
              return RefreshIndicator(
                onRefresh: controller.refreshConversations,
                child: ListView.separated(
                  padding: EdgeInsets.symmetric(
                    vertical: screenSize.height * 0.01,
                  ),
                  itemCount: controller.conversations.length,
                  separatorBuilder: (context, index) => Divider(
                    height: 1,
                    indent: screenSize.width * 0.2,
                  ),
                  itemBuilder: (context, index) {
                    final conversation = controller.conversations[index];
                    return _buildConversationTile(
                      conversation,
                      controller,
                      screenSize,
                    );
                  },
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildConversationTile(
    Map<String, dynamic> conversation,
    ChatListController controller,
    Size screenSize,
  ) {
    final otherUser = controller.getOtherUser(conversation);
    final lastMessage = conversation['lastMessage'] as Map<String, dynamic>?;
    final hasUnread = controller.hasUnreadMessages(conversation);

    return ListTile(
      contentPadding: EdgeInsets.symmetric(
        horizontal: screenSize.width * 0.04,
        vertical: screenSize.height * 0.01,
      ),
      leading: Stack(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: Colors.grey[300],
            backgroundImage: otherUser?['avatarUrl'] != null
                ? NetworkImage(otherUser!['avatarUrl'])
                : null,
            child: otherUser?['avatarUrl'] == null
                ? Icon(Icons.person, size: 32, color: Colors.grey[600])
                : null,
          ),
          // Unread indicator
          if (hasUnread)
            Positioned(
              right: 0,
              top: 0,
              child: Container(
                width: 12,
                height: 12,
                decoration: BoxDecoration(
                  color: Colors.blue,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                ),
              ),
            ),
        ],
      ),
      title: Row(
        children: [
          Expanded(
            child: Text(
              otherUser?['name'] ?? 'Người dùng',
              style: TextStyle(
                fontSize: screenSize.width * 0.04,
                fontWeight: hasUnread ? FontWeight.bold : FontWeight.w600,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Text(
            controller.formatLastMessageTime(
              conversation['lastMessageAt'] as String?,
            ),
            style: TextStyle(
              fontSize: screenSize.width * 0.032,
              color: hasUnread ? Colors.blue : Colors.grey[600],
              fontWeight: hasUnread ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
        ],
      ),
      subtitle: Padding(
        padding: EdgeInsets.only(top: screenSize.height * 0.005),
        child: Row(
          children: [
            // Sent indicator
            if (lastMessage != null &&
                lastMessage['senderId'] == controller.currentUserId) ...[
              Icon(
                Icons.done_all,
                size: 16,
                color: lastMessage['status'] == 'RECEIVED'
                    ? Colors.blue
                    : Colors.grey,
              ),
              const SizedBox(width: 4),
            ],
            Expanded(
              child: Text(
                controller.getLastMessagePreview(lastMessage),
                style: TextStyle(
                  fontSize: screenSize.width * 0.036,
                  color: hasUnread ? Colors.black87 : Colors.grey[600],
                  fontWeight: hasUnread ? FontWeight.w500 : FontWeight.normal,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
      onTap: () {
        final otherUserId = otherUser?['id'] as String?;
        final otherUserName = otherUser?['name'] as String?;
        final otherUserAvatar = otherUser?['avatarUrl'] as String?;
        final conversationId = conversation['id'] as String?;

        if (otherUserId == null) {
          Get.snackbar(
            'Lỗi',
            'Không tìm thấy thông tin người dùng',
            snackPosition: SnackPosition.BOTTOM,
          );
          return;
        }

        // Create chat controller with unique tag
        final chatController = Get.put(
          ChatController(),
          tag: 'chat_$otherUserId',
        );

        // Set data directly in controller
        chatController.otherUserId = otherUserId;
        chatController.otherUserName = otherUserName ?? 'Người dùng';
        chatController.otherUserAvatar = otherUserAvatar;
        chatController.conversationId = conversationId;

        // Initialize chat
        chatController.initializeChatWithData();

        // Navigate to chat screen
        Get.to(() => ChatPage(posterId: otherUserId));
      },
    );
  }

  Widget _buildEmptyState(
    ChatListController controller,
    Size screenSize,
  ) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.chat_bubble_outline,
            size: screenSize.width * 0.2,
            color: Colors.grey[400],
          ),
          SizedBox(height: screenSize.height * 0.03),
          Text(
            controller.searchQuery.value.isEmpty
                ? 'Chưa có cuộc trò chuyện nào'
                : 'Không tìm thấy cuộc trò chuyện',
            style: TextStyle(
              fontSize: screenSize.width * 0.045,
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
          SizedBox(height: screenSize.height * 0.01),
          Text(
            controller.searchQuery.value.isEmpty
                ? 'Bắt đầu trò chuyện bằng cách nhắn tin cho người khác'
                : 'Thử tìm kiếm với từ khóa khác',
            style: TextStyle(
              fontSize: screenSize.width * 0.035,
              color: Colors.grey[500],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(
    ChatListController controller,
    Size screenSize,
  ) {
    return Center(
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: screenSize.width * 0.1),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: screenSize.width * 0.2,
              color: Colors.red,
            ),
            SizedBox(height: screenSize.height * 0.03),
            Text(
              'Lỗi tải dữ liệu',
              style: TextStyle(
                fontSize: screenSize.width * 0.05,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: screenSize.height * 0.02),
            Text(
              controller.errorMessage.value!,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: screenSize.width * 0.038,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: screenSize.height * 0.04),
            ElevatedButton.icon(
              onPressed: controller.refreshConversations,
              icon: const Icon(Icons.refresh),
              label: const Text('Thử lại'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}