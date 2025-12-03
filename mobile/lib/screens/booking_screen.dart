import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/booking_controller.dart';
import 'package:mobile/widgets/loading.dart';


class BookingsPage extends StatelessWidget {
  const BookingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<BookingsController>();
    final Size screenSize = MediaQuery.of(context).size;
    
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Đơn đặt sân'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Sắp tới'),
              Tab(text: 'Đã qua'),
            ],
          ),
        ),
        body: Obx(() {
          if (controller.isLoading.value) {
            return loadingIndicator();
          }

          if (controller.errorMessage.value != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: screenSize.width * 0.15,
                    color: Colors.red,
                  ),
                  SizedBox(height: screenSize.height * 0.02),
                  Text(
                    controller.errorMessage.value!,
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: screenSize.width * 0.04),
                  ),
                  SizedBox(height: screenSize.height * 0.02),
                  ElevatedButton(
                    onPressed: controller.retry,
                    child: const Text('Thử lại'),
                  ),
                ],
              ),
            );
          }

          return TabBarView(
            children: [
              _buildBookingList(controller.upcomingOrders, true, screenSize, controller),
              _buildBookingList(controller.pastOrders, false, screenSize, controller),
            ],
          );
        }),
      ),
    );
  }

  Widget _buildBookingList(
    List<Map<String, dynamic>> orders,
    bool isUpcoming,
    Size screenSize,
    BookingsController controller,
  ) {
    if (orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.calendar_today_outlined,
              size: screenSize.width * 0.15,
              color: Colors.grey,
            ),
            SizedBox(height: screenSize.height * 0.02),
            Text(
              isUpcoming ? 'Không có đơn đặt sân sắp tới' : 'Không có lịch sử đặt sân',
              style: TextStyle(
                fontSize: screenSize.width * 0.04,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: EdgeInsets.all(screenSize.width * 0.04),
      itemCount: orders.length,
      itemBuilder: (context, index) {
        final order = orders[index];
        final orderDetails = order['orderDetails'] as List<dynamic>;
        
        final earliestStart = controller.getEarliestStartTime(order)!;
        final latestEnd = controller.getLatestEndTime(order)!;

        return Card(
          margin: EdgeInsets.only(bottom: screenSize.height * 0.02),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 2,
          child: Padding(
            padding: EdgeInsets.all(screenSize.width * 0.04),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: screenSize.width * 0.15,
                      height: screenSize.width * 0.15,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        image: const DecorationImage(
                          image: AssetImage('assets/images/login_1.webp'),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    SizedBox(width: screenSize.width * 0.03),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Mã đơn: ${order['orderCode']}',
                            style: TextStyle(
                              fontSize: screenSize.width * 0.04,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: screenSize.height * 0.005),
                          Row(
                            children: [
                              Icon(
                                Icons.location_on,
                                size: screenSize.width * 0.04,
                                color: Colors.grey,
                              ),
                              SizedBox(width: screenSize.width * 0.01),
                              Text(
                                'Đà Nẵng',
                                style: TextStyle(
                                  fontSize: screenSize.width * 0.035,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: screenSize.width * 0.03,
                        vertical: screenSize.height * 0.006,
                      ),
                      decoration: BoxDecoration(
                        color: order['statusPayment'] == 'PAID'
                            ? Colors.green.withOpacity(0.1)
                            : Colors.orange.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        order['statusPayment'] == 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán',
                        style: TextStyle(
                          color: order['statusPayment'] == 'PAID' ? Colors.green : Colors.orange,
                          fontSize: screenSize.width * 0.03,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: screenSize.height * 0.02),
                const Divider(),
                _buildBookingDetail(
                  'Ngày:',
                  controller.formatDate(earliestStart),
                  screenSize,
                ),
                _buildBookingDetail(
                  'Thời gian:',
                  controller.formatTime(earliestStart, latestEnd),
                  screenSize,
                ),
                _buildBookingDetail(
                  'Số sân:',
                  '${orderDetails.length} sân',
                  screenSize,
                ),
                _buildBookingDetail(
                  'Tổng tiền:',
                  controller.formatPrice(order['cost']),
                  screenSize,
                ),
                if (isUpcoming && order['statusPayment'] != 'PAID') ...[
                  SizedBox(height: screenSize.height * 0.02),
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
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            side: BorderSide(color: Colors.red.shade400),
                          ),
                          child: Text(
                            'Hủy đơn',
                            style: TextStyle(color: Colors.red.shade400),
                          ),
                        ),
                      ),
                      SizedBox(width: screenSize.width * 0.03),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () => controller.payOrder(order['_id']),
                          style: ElevatedButton.styleFrom(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text('Thanh toán'),
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildBookingDetail(String label, String value, Size screenSize) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: screenSize.height * 0.006),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: screenSize.width * 0.035,
              color: Colors.grey[600],
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: screenSize.width * 0.035,
              fontWeight: FontWeight.w600,
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
        title: const Text('Xác nhận hủy đơn'),
        content: const Text('Bạn có chắc chắn muốn hủy đơn đặt sân này?'),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('Không'),
          ),
          ElevatedButton(
            onPressed: () {
              Get.back();
              controller.cancelOrder(orderId);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            child: const Text('Hủy đơn'),
          ),
        ],
      ),
    );
  }
}