import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/post_controller.dart';
import 'package:mobile/widgets/loading.dart';

class SelectMatchesPage extends StatelessWidget {
  final String orderId;

  const SelectMatchesPage({
    super.key,
    required this.orderId,
  });

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<PostController>();
    final Size screenSize = MediaQuery.of(context).size;

    // Load matches khi mở page
    WidgetsBinding.instance.addPostFrameCallback((_) {
      controller.loadMatches(orderId);
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Chọn trận đấu'),
        centerTitle: true,
        elevation: 0,
      ),
      body: Obx(() {
        // Loading state
        if (controller.isLoading.value && controller.matches.isEmpty) {
          return loadingIndicator();
        }

        // Error state
        if (controller.errorMessage.value != null && controller.matches.isEmpty) {
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
                    onPressed: () => controller.loadMatches(orderId),
                    icon: const Icon(Icons.refresh),
                    label: const Text('Thử lại'),
                  ),
                ],
              ),
            ),
          );
        }

        // Empty state
        if (controller.matches.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.sports_soccer,
                  size: screenSize.width * 0.2,
                  color: Colors.grey[400],
                ),
                SizedBox(height: screenSize.height * 0.03),
                Text(
                  'Không có trận đấu nào',
                  style: TextStyle(
                    fontSize: screenSize.width * 0.045,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          );
        }

        // List matches
        return Column(
          children: [
            // Header
            Container(
              padding: EdgeInsets.all(screenSize.width * 0.04),
              color: Colors.blue.shade50,
              child: Row(
                children: [
                  Icon(
                    Icons.info_outline,
                    color: Colors.blue.shade700,
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Chọn các trận đấu bạn muốn tuyển người chơi vãng lai',
                      style: TextStyle(
                        fontSize: screenSize.width * 0.035,
                        color: Colors.blue.shade900,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // List
            Expanded(
              child: ListView.builder(
                padding: EdgeInsets.all(screenSize.width * 0.04),
                itemCount: controller.matches.length,
                itemBuilder: (context, index) {
                  final match = controller.matches[index];
                  final matchId = match['id'] as String;
                  final isSelected = controller.isMatchSelected(matchId);

                  return Card(
                    margin: EdgeInsets.only(bottom: screenSize.height * 0.015),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(
                        color: isSelected
                            ? Theme.of(context).colorScheme.primary
                            : Colors.transparent,
                        width: 2,
                      ),
                    ),
                    elevation: isSelected ? 4 : 2,
                    child: CheckboxListTile(
                      value: isSelected,
                      onChanged: (_) => controller.toggleMatchSelection(matchId),
                      title: Text(
                        _formatMatchTitle(match),
                        style: TextStyle(
                          fontSize: screenSize.width * 0.04,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 8),
                          _buildInfoRow(
                            Icons.calendar_today,
                            _formatDate(match['date']),
                            screenSize,
                          ),
                          const SizedBox(height: 4),
                          _buildInfoRow(
                            Icons.access_time,
                            _formatTime(
                              match['startTime'],
                              match['endTime'],
                            ),
                            screenSize,
                          ),
                          const SizedBox(height: 4),
                          _buildInfoRow(
                            Icons.sports_soccer,
                            match['sport']?['name'] ?? 'N/A',
                            screenSize,
                          ),
                          const SizedBox(height: 4),
                          _buildInfoRow(
                            Icons.attach_money,
                            '${match['price']}đ',
                            screenSize,
                          ),
                        ],
                      ),
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: screenSize.width * 0.04,
                        vertical: screenSize.height * 0.01,
                      ),
                      activeColor: Theme.of(context).colorScheme.primary,
                    ),
                  );
                },
              ),
            ),

            // Bottom action bar
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
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Đã chọn: ${controller.selectedMatchIds.length} trận',
                            style: TextStyle(
                              fontSize: screenSize.width * 0.038,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    ElevatedButton(
                      onPressed: controller.selectedMatchIds.isEmpty
                          ? null
                          : () {
                              Get.toNamed(
                                '/create-post',
                                arguments: {
                                  'orderId': orderId,
                                },
                              );
                            },
                      style: ElevatedButton.styleFrom(
                        padding: EdgeInsets.symmetric(
                          horizontal: screenSize.width * 0.08,
                          vertical: screenSize.height * 0.018,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        'Tiếp tục',
                        style: TextStyle(
                          fontSize: screenSize.width * 0.04,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      }),
    );
  }

  Widget _buildInfoRow(IconData icon, String text, Size screenSize) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey[600]),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              fontSize: screenSize.width * 0.035,
              color: Colors.grey[700],
            ),
          ),
        ),
      ],
    );
  }

  String _formatMatchTitle(Map<String, dynamic> match) {
    final fieldName = match['field']?['name'] ?? 'Sân';
    return fieldName;
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null) return 'N/A';
    try {
      final date = DateTime.parse(dateStr);
      return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
    } catch (e) {
      return dateStr;
    }
  }

  String _formatTime(String? startTime, String? endTime) {
    if (startTime == null || endTime == null) return 'N/A';
    
    try {
      // Parse time from HH:mm:ss format
      final start = startTime.split(':');
      final end = endTime.split(':');
      
      return '${start[0]}:${start[1]} - ${end[0]}:${end[1]}';
    } catch (e) {
      return '$startTime - $endTime';
    }
  }
}