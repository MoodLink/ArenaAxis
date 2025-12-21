import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/my_post_controller.dart';
import 'package:mobile/widgets/build_infor_row.dart';
import 'package:mobile/widgets/loading.dart';

class MyPostsPage extends StatelessWidget {
  const MyPostsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<MyPostsController>();
    final Size screenSize = MediaQuery.of(context).size;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bài đăng của tôi'),
        centerTitle: true,
        elevation: 0,
      ),
      body: Obx(() {
        // Loading state
        if (controller.isLoading.value && controller.posts.isEmpty) {
          return loadingIndicator();
        }

        // Error state
        if (controller.errorMessage.value != null && controller.posts.isEmpty) {
          return _buildErrorState(controller, screenSize);
        }

        // Empty state
        if (controller.posts.isEmpty) {
          return _buildEmptyState(screenSize);
        }

        // Posts list
        return RefreshIndicator(
          onRefresh: controller.refreshPosts,
          child: ListView.builder(
            padding: EdgeInsets.all(screenSize.width * 0.04),
            itemCount:
                controller.posts.length + (controller.hasMore.value ? 1 : 0),
            itemBuilder: (context, index) {
              // Load more indicator
              if (index == controller.posts.length) {
                if (controller.isLoadingMore.value) {
                  return const Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Center(child: CircularProgressIndicator()),
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
              return _buildMyPostCard(post, controller, screenSize);
            },
          ),
        );
      }),
    );
  }

  Widget _buildMyPostCard(
    Map<String, dynamic> post,
    MyPostsController controller,
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
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 2,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          // Show applicants list on long press
          _showApplicantsDialog(Get.context!, post, participants, screenSize);
        },
        onLongPress: () {},
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
                buildInfoRow(
                  Icons.store,
                  controller.getStoreName(store),
                  screenSize,
                ),
                const SizedBox(height: 8),
                buildInfoRow(
                  Icons.location_city,
                  store?['address'] ?? 'N/A',
                  screenSize,
                ),
                const SizedBox(height: 8),
                buildInfoRow(
                  Icons.calendar_today,
                  controller.getMatchDate(matches),
                  screenSize,
                ),
                const SizedBox(height: 8),
                buildInfoRow(
                  Icons.access_time,
                  controller.getTimeRange(matches),
                  screenSize,
                ),
                const SizedBox(height: 8),
              ],

              // Price per person
              buildInfoRow(
                Icons.attach_money,
                '${controller.formatPrice(post['pricePerPerson'])} / người',
                screenSize,
              ),

              SizedBox(height: screenSize.height * 0.015),
              const Divider(height: 1),
              SizedBox(height: screenSize.height * 0.015),

              // Footer - Participants info with hint
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
                            final participant =
                                participants[index] as Map<String, dynamic>;
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
                                      ? NetworkImage(participant['avatarUrl'])
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

                  // Hint for long press
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.orange.shade50,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: Colors.orange.shade200,
                        width: 1,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.touch_app,
                          size: 14,
                          color: Colors.orange.shade700,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Nhấn giữ',
                          style: TextStyle(
                            fontSize: 11,
                            color: Colors.orange.shade700,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
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

  void _showApplicantsDialog(
    BuildContext context,
    Map<String, dynamic> post,
    List<dynamic> participants,
    Size screenSize,
  ) {
    Get.dialog(
      AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF00C17C), Color(0xFF2196F3)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.people, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                'Danh sách người tham gia',
                style: TextStyle(fontSize: 16),
              ),
            ),
          ],
        ),
        content: participants.isEmpty
            ? const Padding(
                padding: EdgeInsets.all(20.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.people_outline, size: 64, color: Colors.grey),
                    SizedBox(height: 16),
                    Text(
                      'Chưa có người tham gia',
                      style: TextStyle(color: Colors.grey, fontSize: 14),
                    ),
                  ],
                ),
              )
            : SizedBox(
                width: double.maxFinite,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Summary
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.blue.shade50,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.groups,
                            color: Colors.blue.shade700,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Tổng cộng: ${participants.length} người',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: Colors.blue.shade700,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    // List
                    Flexible(
                      child: ListView.separated(
                        shrinkWrap: true,
                        itemCount: participants.length,
                        separatorBuilder: (context, index) =>
                            const Divider(height: 1),
                        itemBuilder: (context, index) {
                          final participant =
                              participants[index] as Map<String, dynamic>;
                          return ListTile(
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            leading: CircleAvatar(
                              radius: 22,
                              backgroundColor: Colors.grey[300],
                              backgroundImage: participant['avatarUrl'] != null
                                  ? NetworkImage(participant['avatarUrl'])
                                  : null,
                              child: participant['avatarUrl'] == null
                                  ? const Icon(Icons.person)
                                  : null,
                            ),
                            title: Text(
                              participant['name'] ?? 'N/A',
                              style: const TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 14,
                              ),
                            ),
                            subtitle: participant['phone'] != null
                                ? Text(
                                    participant['phone'],
                                    style: const TextStyle(fontSize: 12),
                                  )
                                : null,
                            trailing: IconButton(
                              icon: Icon(
                                Icons.message_outlined,
                                color: Colors.blue.shade600,
                                size: 20,
                              ),
                              onPressed: () {
                                // TODO: Open chat with participant
                                Get.back();
                                Get.snackbar(
                                  'Thông báo',
                                  'Tính năng chat đang phát triển',
                                  snackPosition: SnackPosition.BOTTOM,
                                );
                              },
                              tooltip: 'Nhắn tin',
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
        actions: [
          TextButton(onPressed: () => Get.back(), child: const Text('Đóng')),
        ],
      ),
    );
  }

  Widget _buildEmptyState(Size screenSize) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.post_add,
            size: screenSize.width * 0.2,
            color: Colors.grey[400],
          ),
          SizedBox(height: screenSize.height * 0.03),
          Text(
            'Bạn chưa có bài đăng nào',
            style: TextStyle(
              fontSize: screenSize.width * 0.045,
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
          SizedBox(height: screenSize.height * 0.01),
          Text(
            'Các bài đăng của bạn sẽ hiển thị tại đây',
            style: TextStyle(
              fontSize: screenSize.width * 0.035,
              color: Colors.grey[500],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(MyPostsController controller, Size screenSize) {
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
}
