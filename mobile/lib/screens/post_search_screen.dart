import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/post_search_controller.dart';
import 'package:mobile/controller/chat_controller.dart';
import 'package:mobile/screens/chat_screen.dart';
import 'package:mobile/screens/chat_list_screen.dart';
import 'package:mobile/widgets/loading.dart';
import 'package:intl/intl.dart';

class PostSearchPage extends StatelessWidget {
  const PostSearchPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<PostSearchController>();  
    final Size screenSize = MediaQuery.of(context).size;
    controller.loadInitialData();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tìm người chơi'),
        centerTitle: true,
        elevation: 0,
        actions: [
          // Chat list button
          IconButton(
            onPressed: () {
              Get.to(() => const ChatListScreen());
            },
            icon: Stack(
              children: [
                const Icon(Icons.chat_bubble_outline),
              ],
            ),
            tooltip: 'Tin nhắn',
          ),
          // Notification button
          IconButton(
            onPressed: () {
              // TODO: Navigate to notifications page
            },
            icon: const Icon(Icons.notifications_outlined),
            tooltip: 'Thông báo',
          ),
          // Filter badge with count
          Obx(() {
            final filterCount = controller.activeFiltersCount;
            return Stack(
              children: [
                IconButton(
                  onPressed: () => _showFilterBottomSheet(context, controller),
                  icon: const Icon(Icons.filter_list),
                  tooltip: 'Bộ lọc',
                ),
                if (filterCount > 0)
                  Positioned(
                    right: 8,
                    top: 8,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Color(0xFF00C17C), Color(0xFF2196F3)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        shape: BoxShape.circle,
                      ),
                      constraints: const BoxConstraints(
                        minWidth: 16,
                        minHeight: 16,
                      ),
                      child: Text(
                        '$filterCount',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
              ],
            );
          }),
        ],
      ),
      body: Column(
        children: [
          // Active filters chips with gradient
          Obx(() {
            if (controller.hasActiveFilters) {
              return Container(
                width: double.infinity,
                padding: EdgeInsets.all(screenSize.width * 0.03),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF00C17C).withOpacity(0.1),
                      const Color(0xFF2196F3).withOpacity(0.1),
                    ],
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                  ),
                  border: Border(
                    bottom: BorderSide(
                      color: const Color(0xFF00C17C).withOpacity(0.3),
                      width: 1,
                    ),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [Color(0xFF00C17C), Color(0xFF2196F3)],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(
                                Icons.filter_list,
                                size: 16,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Bộ lọc đang áp dụng:',
                              style: TextStyle(
                                fontSize: screenSize.width * 0.035,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF00C17C),
                              ),
                            ),
                          ],
                        ),
                        TextButton.icon(
                          onPressed: () {
                            controller.clearFilters();
                            controller.applyFilters();
                          },
                          icon: const Icon(Icons.clear_all, size: 16),
                          label: const Text('Xóa tất cả'),
                          style: TextButton.styleFrom(
                            foregroundColor: const Color(0xFF2196F3),
                            padding: EdgeInsets.zero,
                            minimumSize: const Size(0, 30),
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        if (controller.storeName.value != null)
                          _buildFilterChip(
                            context,
                            'Cửa hàng: ${controller.storeName.value}',
                            () {
                              controller.setStoreName(null);
                              controller.applyFilters();
                            },
                          ),
                        if (controller.fromDate.value != null)
                          _buildFilterChip(
                            context,
                            'Từ: ${DateFormat('dd/MM/yyyy').format(controller.fromDate.value!)}',
                            () {
                              controller.setFromDate(null);
                              controller.applyFilters();
                            },
                          ),
                        if (controller.toDate.value != null)
                          _buildFilterChip(
                            context,
                            'Đến: ${DateFormat('dd/MM/yyyy').format(controller.toDate.value!)}',
                            () {
                              controller.setToDate(null);
                              controller.applyFilters();
                            },
                          ),
                        if (controller.selectedSportId.value != null)
                          _buildFilterChip(
                            context,
                            controller.getSportNameById(
                              controller.selectedSportId.value,
                            ),
                            () {
                              controller.setSport(null);
                              controller.applyFilters();
                            },
                          ),
                        if (controller.selectedProvinceId.value != null)
                          _buildFilterChip(
                            context,
                            controller.getProvinceName(
                              controller.selectedProvinceId.value,
                            ),
                            () {
                              controller.setProvince(null);
                              controller.applyFilters();
                            },
                          ),
                        if (controller.selectedWardId.value != null)
                          _buildFilterChip(
                            context,
                            controller.getWardName(
                              controller.selectedWardId.value,
                            ),
                            () {
                              controller.setWard(null);
                              controller.applyFilters();
                            },
                          ),
                      ],
                    ),
                  ],
                ),
              );
            }
            return const SizedBox.shrink();
          }),

          // Posts list
          Expanded(
            child: Obx(() {
              // Loading state
              if (controller.isLoading.value && controller.posts.isEmpty) {
                return loadingIndicator();
              }

              // Error state
              if (controller.errorMessage.value != null &&
                  controller.posts.isEmpty) {
                return _buildErrorState(controller, screenSize);
              }

              // Empty state
              if (controller.posts.isEmpty) {
                return _buildEmptyState(controller, screenSize);
              }

              // Posts list
              return RefreshIndicator(
                onRefresh: controller.refreshPosts,
                child: ListView.builder(
                  padding: EdgeInsets.all(screenSize.width * 0.04),
                  itemCount: controller.posts.length +
                      (controller.hasMore.value ? 1 : 0),
                  itemBuilder: (context, index) {
                    // Load more indicator
                    if (index == controller.posts.length) {
                      if (controller.isLoadingMore.value) {
                        return const Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Center(
                            child: CircularProgressIndicator(),
                          ),
                        );
                      } else {
                        // Trigger load more
                        WidgetsBinding.instance.addPostFrameCallback((_) {
                          controller.loadMore();
                        });
                        return const SizedBox.shrink();
                      }
                    }

                    final post = controller.posts[index];
                    return _buildPostCard(post, controller, screenSize);
                  },
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(
    BuildContext context,
    String label,
    VoidCallback onDeleted,
  ) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(0xFF00C17C).withOpacity(0.15),
            const Color(0xFF2196F3).withOpacity(0.15),
          ],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: const Color(0xFF00C17C).withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onDeleted,
          borderRadius: BorderRadius.circular(20),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF00C17C),
                  ),
                ),
                const SizedBox(width: 6),
                Container(
                  padding: const EdgeInsets.all(2),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF00C17C), Color(0xFF2196F3)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.close,
                    size: 14,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPostCard(
    Map<String, dynamic> post,
    PostSearchController controller,
    Size screenSize,
  ) {
    final matches = post['matches'] as List<dynamic>? ?? [];
    final poster = post['poster'] as Map<String, dynamic>?;
    final participants = post['participants'] as List<dynamic>? ?? [];
    final requiredNumber = post['requiredNumber'] as int? ?? 0;
    final currentNumber = post['currentNumber'] as int? ?? 0;
    final sport = post['sport'] as Map<String, dynamic>?;
    final store = post['store'] as Map<String, dynamic>?;

    return Card(
      margin: EdgeInsets.only(bottom: screenSize.height * 0.015),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 2,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          // TODO: Navigate to post detail
        },
        child: Padding(
          padding: EdgeInsets.all(screenSize.width * 0.04),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header - Poster info
              Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: Colors.grey[300],
                    backgroundImage: poster?['avatarUrl'] != null
                        ? NetworkImage(poster!['avatarUrl'])
                        : null,
                    child: poster?['avatarUrl'] == null
                        ? Icon(Icons.person, color: Colors.grey[600])
                        : null,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          poster?['name'] ?? 'N/A',
                          style: TextStyle(
                            fontSize: screenSize.width * 0.04,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          post['timestamp'] ?? 'N/A',
                          style: TextStyle(
                            fontSize: screenSize.width * 0.032,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Sport badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      controller.getSportName(sport),
                      style: TextStyle(
                        fontSize: screenSize.width * 0.032,
                        color: Colors.blue.shade700,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),

              SizedBox(height: screenSize.height * 0.015),

              // Title
              Text(
                post['title'] ?? 'N/A',
                style: TextStyle(
                  fontSize: screenSize.width * 0.045,
                  fontWeight: FontWeight.bold,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),

              SizedBox(height: screenSize.height * 0.01),

              // Description
              if (post['description'] != null &&
                  (post['description'] as String).isNotEmpty)
                Text(
                  post['description'] ?? '',
                  style: TextStyle(
                    fontSize: screenSize.width * 0.036,
                    color: Colors.grey[700],
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),

              SizedBox(height: screenSize.height * 0.015),
              const Divider(height: 1),
              SizedBox(height: screenSize.height * 0.015),

              // Match details
              if (matches.isNotEmpty) ...[
                _buildInfoRow(
                  Icons.store,
                  controller.getStoreName(store),
                  screenSize,
                ),
                const SizedBox(height: 8),
                _buildInfoRow(
                  Icons.calendar_today,
                  controller.getMatchDate(matches),
                  screenSize,
                ),
                const SizedBox(height: 8),
                _buildInfoRow(
                  Icons.access_time,
                  controller.getTimeRange(matches),
                  screenSize,
                ),
                const SizedBox(height: 8),
              ],

              // Price per person
              _buildInfoRow(
                Icons.attach_money,
                '${controller.formatPrice(post['pricePerPerson'])} / người',
                screenSize,
              ),

              SizedBox(height: screenSize.height * 0.015),
              const Divider(height: 1),
              SizedBox(height: screenSize.height * 0.015),

              // Footer - Participants info and actions
              Row(
                children: [
                  // Avatars stack
                  if (participants.isNotEmpty) ...[
                    SizedBox(
                      width: 80,
                      height: 30,
                      child: Stack(
                        children: List.generate(
                          participants.length > 3 ? 3 : participants.length,
                          (index) {
                            final participant = participants[index]
                                as Map<String, dynamic>;
                            return Positioned(
                              left: index * 20.0,
                              child: CircleAvatar(
                                radius: 15,
                                backgroundColor: Colors.white,
                                child: CircleAvatar(
                                  radius: 13,
                                  backgroundColor: Colors.grey[300],
                                  backgroundImage:
                                      participant['avatarUrl'] != null
                                          ? NetworkImage(
                                              participant['avatarUrl'])
                                          : null,
                                  child: participant['avatarUrl'] == null
                                      ? Icon(
                                          Icons.person,
                                          size: 16,
                                          color: Colors.grey[600],
                                        )
                                      : null,
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                  ],

                  // Count
                  Expanded(
                    child: Text(
                      '$currentNumber/$requiredNumber người',
                      style: TextStyle(
                        fontSize: screenSize.width * 0.036,
                        color: Colors.grey[700],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),

                  // Message button
                  IconButton(
                    onPressed: () {
                      final posterId = poster?['id'] as String?;
                      final posterName = poster?['name'] as String?;
                      final posterAvatar = poster?['avatarUrl'] as String?;

                      if (posterId == null || posterId.isEmpty) {
                        Get.snackbar(
                          'Lỗi',
                          'Không tìm thấy thông tin người đăng bài',
                          snackPosition: SnackPosition.BOTTOM,
                          backgroundColor: Get.theme.colorScheme.error,
                          colorText: Get.theme.colorScheme.onError,
                        );
                        return;
                      }

                      final chatController = Get.put(
                        ChatController(),
                        tag: 'chat_$posterId',
                      );

                      chatController.otherUserId = posterId;
                      chatController.otherUserName = posterName ?? 'Người dùng';
                      chatController.otherUserAvatar = posterAvatar;
                      chatController.initializeChatWithData();

                      Get.to(() => ChatPage(posterId: posterId));
                    },
                    icon: Icon(
                      Icons.message_outlined,
                      color: Colors.blue.shade600,
                    ),
                    tooltip: 'Nhắn tin',
                    style: IconButton.styleFrom(
                      backgroundColor: Colors.blue.shade50,
                      padding: const EdgeInsets.all(8),
                    ),
                  ),

                  const SizedBox(width: 8),

                  // Join button
                  ElevatedButton.icon(
                    onPressed: () {
                      final availableSlots = requiredNumber - currentNumber;
                      if (availableSlots <= 0) {
                        Get.snackbar(
                          'Thông báo',
                          'Bài đăng đã đủ người',
                          snackPosition: SnackPosition.BOTTOM,
                        );
                        return;
                      }

                      _showJoinDialog(Get.context!, post, controller);
                    },
                    icon: const Icon(Icons.person_add, size: 18),
                    label: const Text(
                      'Tham gia',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green.shade600,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 10,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showJoinDialog(
    BuildContext context,
    Map<String, dynamic> post,
    PostSearchController controller,
  ) {
    final requiredNumber = post['requiredNumber'] as int? ?? 0;
    final currentNumber = post['currentNumber'] as int? ?? 0;
    final availableSlots = requiredNumber - currentNumber;

    Get.dialog(
      AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text('Tham gia bài đăng'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Bạn có muốn tham gia bài đăng này không?'),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    post['title'] ?? 'N/A',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.people, size: 16, color: Colors.grey[600]),
                      const SizedBox(width: 4),
                      Text(
                        'Còn $availableSlots chỗ trống',
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey[700],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(Icons.attach_money, size: 16, color: Colors.grey[600]),
                      const SizedBox(width: 4),
                      Text(
                        '${controller.formatPrice(post['pricePerPerson'])} / người',
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey[700],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('Hủy'),
          ),
          ElevatedButton(
            onPressed: () {
              Get.back();
              // TODO: Call API to join post
              Get.snackbar(
                'Thành công',
                'Đã gửi yêu cầu tham gia',
                snackPosition: SnackPosition.BOTTOM,
                backgroundColor: Colors.green,
                colorText: Colors.white,
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green.shade600,
              foregroundColor: Colors.white,
            ),
            child: const Text('Xác nhận'),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String text, Size screenSize) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey[600]),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              fontSize: screenSize.width * 0.036,
              color: Colors.grey[700],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState(
    PostSearchController controller,
    Size screenSize,
  ) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.search_off,
            size: screenSize.width * 0.2,
            color: Colors.grey[400],
          ),
          SizedBox(height: screenSize.height * 0.03),
          Text(
            'Không tìm thấy bài đăng nào',
            style: TextStyle(
              fontSize: screenSize.width * 0.045,
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
          SizedBox(height: screenSize.height * 0.01),
          Text(
            controller.hasActiveFilters
                ? 'Thử thay đổi bộ lọc tìm kiếm'
                : 'Chưa có bài đăng nào',
            style: TextStyle(
              fontSize: screenSize.width * 0.035,
              color: Colors.grey[500],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(
    PostSearchController controller,
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
              onPressed: controller.refreshPosts,
              icon: const Icon(Icons.refresh),
              label: const Text('Thử lại'),
            ),
          ],
        ),
      ),
    );
  }

  void _showFilterBottomSheet(
    BuildContext context,
    PostSearchController controller,
  ) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => _FilterBottomSheet(controller: controller),
    );
  }
}

// ============================================================================
// FILTER BOTTOM SHEET - HOÀN CHỈNH
// ============================================================================
class _FilterBottomSheet extends StatefulWidget {
  final PostSearchController controller;

  const _FilterBottomSheet({required this.controller});

  @override
  State<_FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<_FilterBottomSheet> {
  final _storeNameController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _storeNameController.text = widget.controller.storeName.value ?? '';
  }

  @override
  void dispose() {
    _storeNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final Size screenSize = MediaQuery.of(context).size;

    return DraggableScrollableSheet(
      initialChildSize: 0.9,
      minChildSize: 0.5,
      maxChildSize: 0.9,
      expand: false,
      builder: (context, scrollController) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
          ),
          child: Column(
            children: [
              // Drag handle
              Container(
                margin: const EdgeInsets.symmetric(vertical: 8),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),

              // Header with gradient
              Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF00C17C), Color(0xFF2196F3)],
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                  ),
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(20),
                  ),
                ),
                padding: EdgeInsets.symmetric(
                  horizontal: screenSize.width * 0.04,
                  vertical: 16,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Bộ lọc tìm kiếm',
                      style: TextStyle(
                        fontSize: screenSize.width * 0.05,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () {
                        widget.controller.clearFilters();
                        _storeNameController.clear();
                        setState(() {});
                      },
                      icon: const Icon(Icons.clear_all, color: Colors.white, size: 18),
                      label: const Text(
                        'Xóa tất cả',
                        style: TextStyle(color: Colors.white),
                      ),
                      style: TextButton.styleFrom(
                        backgroundColor: Colors.white.withOpacity(0.2),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Filter content
              Expanded(
                child: ListView(
                  controller: scrollController,
                  padding: EdgeInsets.all(screenSize.width * 0.04),
                  children: [
                    // Store Name Filter
                    _buildSectionTitle('Tên cửa hàng', screenSize),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _storeNameController,
                      decoration: InputDecoration(
                        hintText: 'Nhập tên cửa hàng...',
                        prefixIcon: Icon(
                          Icons.store,
                          color: const Color(0xFF00C17C),
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: Colors.grey[300]!),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: Colors.grey[300]!),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(
                            color: Color(0xFF00C17C),
                            width: 2,
                          ),
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Date Range Filter
                    _buildSectionTitle('Khoảng thời gian', screenSize),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: Obx(() => _buildDateSelector(
                                context,
                                'Từ ngày',
                                widget.controller.fromDate.value,
                                (date) => widget.controller.setFromDate(date),
                                screenSize,
                              )),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Obx(() => _buildDateSelector(
                                context,
                                'Đến ngày',
                                widget.controller.toDate.value,
                                (date) => widget.controller.setToDate(date),
                                screenSize,
                              )),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Sport Category Filter
                    _buildSectionTitle('Môn thể thao', screenSize),
                    const SizedBox(height: 8),
                    Obx(() => _buildSportDropdown(screenSize)),

                    const SizedBox(height: 24),

                    // Location Filter
                    _buildSectionTitle('Địa điểm', screenSize),
                    const SizedBox(height: 8),
                    Obx(() => _buildProvinceDropdown(screenSize)),
                    const SizedBox(height: 12),
                    Obx(() {
                      if (widget.controller.selectedProvinceId.value != null) {
                        return _buildWardDropdown(screenSize);
                      }
                      return const SizedBox.shrink();
                    }),

                    const SizedBox(height: 80),
                  ],
                ),
              ),

              // Apply button with gradient
              Container(
                padding: EdgeInsets.all(screenSize.width * 0.04),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 10,
                      offset: const Offset(0, -3),
                    ),
                  ],
                ),
                child: SafeArea(
                  child: SizedBox(
                    width: double.infinity,
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF00C17C), Color(0xFF2196F3)],
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                        ),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF00C17C).withOpacity(0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: ElevatedButton(
                        onPressed: () {
                          widget.controller.setStoreName(_storeNameController.text);
                          widget.controller.applyFilters();
                          Navigator.pop(context);
                        },
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          backgroundColor: Colors.transparent,
                          shadowColor: Colors.transparent,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          'Áp dụng bộ lọc',
                          style: TextStyle(
                            fontSize: screenSize.width * 0.042,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSectionTitle(String title, Size screenSize) {
    return Text(
      title,
      style: TextStyle(
        fontSize: screenSize.width * 0.04,
        fontWeight: FontWeight.w600,
        color: Colors.grey[800],
      ),
    );
  }

  Widget _buildDateSelector(
    BuildContext context,
    String label,
    DateTime? selectedDate,
    Function(DateTime?) onDateSelected,
    Size screenSize,
  ) {
    return InkWell(
      onTap: () async {
        final date = await showDatePicker(
          context: context,
          initialDate: selectedDate ?? DateTime.now(),
          firstDate: DateTime(2020),
          lastDate: DateTime(2030),
        );
        if (date != null) {
          onDateSelected(date);
        }
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey[300]!),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF00C17C), Color(0xFF2196F3)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(
                Icons.calendar_today,
                size: 14,
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: TextStyle(
                      fontSize: screenSize.width * 0.03,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    selectedDate != null
                        ? DateFormat('dd/MM/yyyy').format(selectedDate)
                        : 'Chọn ngày',
                    style: TextStyle(
                      fontSize: screenSize.width * 0.036,
                      fontWeight: selectedDate != null
                          ? FontWeight.w500
                          : FontWeight.normal,
                    ),
                  ),
                ],
              ),
            ),
            if (selectedDate != null)
              GestureDetector(
                onTap: () => onDateSelected(null),
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.clear, size: 16, color: Colors.grey[600]),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSportDropdown(Size screenSize) {
    if (widget.controller.isLoadingSports.value) {
      return const Center(child: CircularProgressIndicator());
    }

    return DropdownButtonFormField<String>(
      value: widget.controller.selectedSportId.value,
      decoration: InputDecoration(
        hintText: 'Chọn môn thể thao',
        prefixIcon: const Icon(
          Icons.sports_soccer,
          color: Color(0xFF00C17C),
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey[300]!),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey[300]!),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: Color(0xFF00C17C),
            width: 2,
          ),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
      items: [
        const DropdownMenuItem<String>(
          value: null,
          child: Text('Tất cả'),
        ),
        ...widget.controller.sports.map((sport) {
          return DropdownMenuItem<String>(
            value: sport['id'] as String,
            child: Text(sport['name'] as String),
          );
        }),
      ],
      onChanged: (value) {
        widget.controller.setSport(value);
      },
    );
  }

  Widget _buildProvinceDropdown(Size screenSize) {
    if (widget.controller.isLoadingProvinces.value) {
      return const Center(child: CircularProgressIndicator());
    }

    return DropdownButtonFormField<String>(
      value: widget.controller.selectedProvinceId.value,
      decoration: InputDecoration(
        hintText: 'Chọn tỉnh/thành phố',
        prefixIcon: const Icon(
          Icons.location_city,
          color: Color(0xFF00C17C),
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey[300]!),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey[300]!),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: Color(0xFF00C17C),
            width: 2,
          ),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
      items: [
        const DropdownMenuItem<String>(
          value: null,
          child: Text('Tất cả'),
        ),
        ...widget.controller.provinces.map((province) {
          return DropdownMenuItem<String>(
            value: province.id,
            child: Text(province.name),
          );
        }),
      ],
      onChanged: (value) {
        widget.controller.setProvince(value);
      },
    );
  }

  Widget _buildWardDropdown(Size screenSize) {
    if (widget.controller.isLoadingWards.value) {
      return const Center(child: CircularProgressIndicator());
    }

    if (widget.controller.wards.isEmpty) {
      return const SizedBox.shrink();
    }

    return DropdownButtonFormField<String>(
      value: widget.controller.selectedWardId.value,
      decoration: InputDecoration(
        hintText: 'Chọn quận/huyện',
        prefixIcon: const Icon(
          Icons.location_on,
          color: Color(0xFF2196F3),
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey[300]!),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey[300]!),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: Color(0xFF2196F3),
            width: 2,
          ),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
      items: [
        const DropdownMenuItem<String>(
          value: null,
          child: Text('Tất cả'),
        ),
        ...widget.controller.wards.map((ward) {
          return DropdownMenuItem<String>(
            value: ward.id,
            child: Text(ward.name),
          );
        }),
      ],
      onChanged: (value) {
        widget.controller.setWard(value);
      },
    );
  }
}