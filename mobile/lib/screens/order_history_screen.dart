import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/controller/booking_controller.dart';
import 'package:mobile/widgets/loading.dart';
import 'package:mobile/widgets/order_detail_dialog.dart';

class OrderHistoryPage extends StatelessWidget {
  const OrderHistoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<BookingsController>();
    final Size screenSize = MediaQuery.of(context).size;

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: Text(
            'Lịch sử đặt sân',
            style: GoogleFonts.roboto(
              fontSize: 32,
              fontWeight: FontWeight.w900,
              letterSpacing: 2,
              foreground: Paint()
                ..shader = LinearGradient(
                  colors: <Color>[Colors.blue, Colors.green],
                ).createShader(Rect.fromLTWH(0.0, 0.0, 200.0, 70.0)),
            ),
          ),
          centerTitle: true,
          elevation: 0,
          bottom: const TabBar(
            indicatorSize: TabBarIndicatorSize.tab,
            labelColor: Colors.black,
            unselectedLabelColor: Colors.grey,
            tabs: [
              Tab(text: 'Sắp diễn ra'),
              Tab(text: 'Đang diễn ra'),
              Tab(text: 'Đã qua'),
            ],
          ),
        ),
        body: Obx(() {
          // 1. Đang tải lần đầu
          if (controller.isLoading.value &&
              controller.upcomingOrders.isEmpty &&
              controller.ongoingOrders.isEmpty &&
              controller.pastOrders.isEmpty) {
            return loadingIndicator();
          }

          // 2. Có lỗi
          if (controller.errorMessage.value != null) {
            return Center(
              child: Padding(
                padding: EdgeInsets.symmetric(
                  horizontal: screenSize.width * 0.1,
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.wifi_off,
                      size: screenSize.width * 0.2,
                      color: Colors.grey,
                    ),
                    SizedBox(height: screenSize.height * 0.03),
                    Text(
                      'Không thể tải dữ liệu',
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
                      onPressed: controller.retry,
                      icon: const Icon(Icons.refresh),
                      label: const Text('Thử lại'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 32,
                          vertical: 14,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }

          // 3. Đã có dữ liệu
          return TabBarView(
            children: [
              _buildRefreshableTab(
                orders: controller.upcomingOrders,
                orderType: OrderType.upcoming,
                screenSize: screenSize,
                controller: controller,
                emptyMessage: 'Không có đơn đặt sân sắp tới',
                emptyIcon: Icons.sports_soccer,
              ),
              _buildRefreshableTab(
                orders: controller.ongoingOrders,
                orderType: OrderType.ongoing,
                screenSize: screenSize,
                controller: controller,
                emptyMessage: 'Không có đơn đang diễn ra',
                emptyIcon: Icons.play_circle_outline,
              ),
              _buildRefreshableTab(
                orders: controller.pastOrders,
                orderType: OrderType.past,
                screenSize: screenSize,
                controller: controller,
                emptyMessage: 'Chưa có lịch sử đặt sân',
                emptyIcon: Icons.history,
              ),
            ],
          );
        }),
      ),
    );
  }

  Widget _buildRefreshableTab({
    required List<Map<String, dynamic>> orders,
    required OrderType orderType,
    required Size screenSize,
    required BookingsController controller,
    required String emptyMessage,
    required IconData emptyIcon,
  }) {
    return RefreshIndicator(
      onRefresh: controller.fetchOrders,
      color: Theme.of(Get.context!).colorScheme.primary,
      backgroundColor: Theme.of(Get.context!).cardColor,
      child: orders.isEmpty
          ? _buildEmptyState(emptyMessage, emptyIcon, screenSize)
          : _buildOrderList(orders, orderType, screenSize, controller),
    );
  }

  Widget _buildEmptyState(String message, IconData icon, Size screenSize) {
    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      children: [
        SizedBox(height: screenSize.height * 0.15),
        Center(
          child: Column(
            children: [
              Icon(
                icon,
                size: screenSize.width * 0.22,
                color: Colors.grey[400],
              ),
              SizedBox(height: screenSize.height * 0.04),
              Text(
                message,
                style: TextStyle(
                  fontSize: screenSize.width * 0.045,
                  color: Colors.grey[600],
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: screenSize.height * 0.02),
              Text(
                'Vuốt xuống để làm mới',
                style: TextStyle(
                  fontSize: screenSize.width * 0.035,
                  color: Colors.grey[500],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildOrderList(
    List<Map<String, dynamic>> orders,
    OrderType orderType,
    Size screenSize,
    BookingsController controller,
  ) {
    return ListView.builder(
      padding: EdgeInsets.all(screenSize.width * 0.04),
      itemCount: orders.length,
      physics: const AlwaysScrollableScrollPhysics(),
      itemBuilder: (context, index) {
        final order = orders[index];
   

        final earliestStart = controller.getEarliestStartTime(order);
        final latestEnd = controller.getLatestEndTime(order);

        if (earliestStart == null || latestEnd == null) {
          return const SizedBox.shrink();
        }

        // Kiểm tra điều kiện hiển thị nút tuyển người chơi
        final isPaid = order['statusPayment'] == 'PAID';
        final canRecruit = controller.canRecruitPlayers(earliestStart);
        final showRecruitButton = orderType == OrderType.upcoming && isPaid && canRecruit;
        final showPaymentButtons = orderType == OrderType.upcoming && !isPaid;

        return Card(
          margin: EdgeInsets.only(bottom: screenSize.height * 0.018),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 3,
          child: InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: () {
              // TODO: Xem chi tiết
            },
            onLongPress: () {
              // Hiển thị dialog chi tiết khi nhấn giữ
              Get.dialog(
                OrderDetailDialog(
                  order: order,
                  controller: controller,
                ),
              );
            },
            child: Padding(
              padding: EdgeInsets.all(screenSize.width * 0.04),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          width: screenSize.width * 0.15,
                          height: screenSize.width * 0.15,
                          color: Colors.grey[300],
                          child:
                              controller.getStoreAvatarUrl(order['storeId']) !=
                                  null
                              ? Image.network(
                                  controller.getStoreAvatarUrl(
                                    order['storeId'],
                                  )!,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) => Icon(
                                    Icons.sports_soccer,
                                    color: Colors.grey[600],
                                  ),
                                )
                              : Icon(
                                  Icons.sports_soccer,
                                  color: Colors.grey[600],
                                ),
                        ),
                      ),
                      SizedBox(width: screenSize.width * 0.03),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              controller.getStoreName(order['storeId']),
                              style: TextStyle(
                                fontSize: screenSize.width * 0.042,
                                fontWeight: FontWeight.bold,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Icon(
                                  Icons.location_on,
                                  size: 16,
                                  color: Colors.grey[600],
                                ),
                                const SizedBox(width: 4),
                                Expanded(
                                  child: Text(
                                    controller.getStoreAddress(
                                      order['storeId'],
                                    ),
                                    style: TextStyle(
                                      fontSize: screenSize.width * 0.034,
                                      color: Colors.grey[600],
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      _buildPaymentStatusTag(
                        order['statusPayment'] as String?,
                        screenSize,
                      ),
                    ],
                  ),

                  SizedBox(height: screenSize.height * 0.02),
                  const Divider(height: 1),

                  // Mã đơn
                  Padding(
                    padding: EdgeInsets.symmetric(
                      vertical: screenSize.height * 0.008,
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.receipt_long,
                          size: 16,
                          color: Colors.grey[600],
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Mã đơn: ',
                          style: TextStyle(
                            fontSize: screenSize.width * 0.036,
                            color: Colors.grey[600],
                          ),
                        ),
                        Text(
                          '${order['originalOrderCode'] ?? order['orderCode'] ?? 'N/A'}',
                          style: TextStyle(
                            fontSize: screenSize.width * 0.036,
                            fontWeight: FontWeight.w600,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                        ),
                        const Spacer(),
                        // Hint text for long press
                        Text(
                          'Giữ để xem chi tiết',
                          style: TextStyle(
                            fontSize: screenSize.width * 0.03,
                            color: Colors.grey[500],
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Chi tiết
                  _buildDetailRow(
                    'Ngày',
                    controller.formatDate(earliestStart),
                    screenSize,
                  ),
                  _buildDetailRow(
                    'Giờ chơi',
                    controller.formatTime(earliestStart, latestEnd),
                    screenSize,
                  ),
                  _buildDetailRow(
                    'Sân',
                    controller.getFieldNames(order),
                    screenSize,
                  ),
                  _buildDetailRow(
                    'Tổng tiền',
                    controller.formatPrice(order['cost'] as int? ?? 0),
                    screenSize,
                  ),

                  // Nút hành động
                  if (showRecruitButton || showPaymentButtons) ...[
                    SizedBox(height: screenSize.height * 0.025),
                    
                    // Nếu đã thanh toán và đủ điều kiện - hiện nút tuyển người chơi
                    if (showRecruitButton)
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            log('Chuyển đến trang tuyển người chơi cho đơn ${order['_id']}');
                            Get.toNamed(
                              '/select-matches',
                              arguments: {'orderId': order['_id']},
                            );
                          },
                          icon: const Icon(Icons.group_add),
                          label: const Text(
                            'Tuyển người chơi vãng lai',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green.shade600,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      )
                    // Nếu chưa thanh toán - hiện nút hủy và thanh toán
                    else if (showPaymentButtons)
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => _showCancelDialog(
                                context,
                                controller,
                                order['_id'],
                              ),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.red.shade600,
                                side: BorderSide(
                                  color: Colors.red.shade400,
                                  width: 1.5,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(vertical: 14),
                              ),
                              child: const Text(
                                'Hủy đơn',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                          SizedBox(width: screenSize.width * 0.03),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () => controller.payOrder(order['_id']),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Theme.of(
                                  context,
                                ).colorScheme.primary,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(vertical: 14),
                              ),
                              child: const Text(
                                'Thanh toán',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                        ],
                      ),
                  ],
                  
                  // Hiển thị thông báo nếu không đủ điều kiện tuyển người
                  if (orderType == OrderType.upcoming && isPaid && !canRecruit) ...[
                    SizedBox(height: screenSize.height * 0.015),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.orange.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: Colors.orange.withOpacity(0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.info_outline,
                            size: 18,
                            color: Colors.orange.shade700,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Chỉ có thể tuyển người khi còn ít nhất 2 ngày trước giờ chơi',
                              style: TextStyle(
                                fontSize: screenSize.width * 0.032,
                                color: Colors.orange.shade800,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildPaymentStatusTag(String? status, Size screenSize) {
    final isPaid = status == 'PAID';
    final text = isPaid ? 'Đã thanh toán' : 'Chưa thanh toán';
    final color = isPaid ? Colors.green.shade700 : Colors.orange.shade700;
    final bgColor = isPaid
        ? Colors.green.withOpacity(0.15)
        : Colors.orange.withOpacity(0.15);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontSize: screenSize.width * 0.032,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, Size screenSize) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: screenSize.height * 0.008),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: screenSize.width * 0.036,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                fontSize: screenSize.width * 0.038,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.right,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  void _showCancelDialog(
    BuildContext context,
    BookingsController controller,
    String orderId,
  ) {
    Get.dialog(
      AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Hủy đơn đặt sân?'),
        content: const Text(
          'Bạn có chắc chắn muốn hủy toàn bộ đơn này không? Tất cả các ngày trong đơn sẽ bị hủy.',
        ),
        actions: [
          TextButton(onPressed: () => Get.back(), child: const Text('Giữ lại')),
          ElevatedButton(
            onPressed: () {
              Get.back();
              controller.cancelOrder(orderId);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('Hủy đơn'),
          ),
        ],
      ),
    );
  }
}

// Enum để phân loại các loại order
enum OrderType {
  upcoming,   // Sắp diễn ra
  ongoing,    // Đang diễn ra
  past,       // Đã qua
}