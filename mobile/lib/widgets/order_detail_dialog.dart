import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/booking_controller.dart';

class OrderDetailDialog extends StatelessWidget {
  final Map<String, dynamic> order;
  final BookingsController controller;

  const OrderDetailDialog({
    super.key,
    required this.order,
    required this.controller,
  });

  @override
  Widget build(BuildContext context) {
    final Size screenSize = MediaQuery.of(context).size;
    final theme = Theme.of(context);

    final storeId = order['storeId'] as String?;
    final orderCode = order['originalOrderCode'] ?? order['orderCode'];
    final statusPayment = order['statusPayment'] as String?;
    final totalCost = order['cost'] as int? ?? 0;
    final isRated = order['isRated'] as bool? ?? false;
    final createdAt = order['createdAt'] as String?;
    final updatedAt = order['updatedAt'] as String?;
    final orderDetails = order['orderDetails'] as List<dynamic>? ?? [];

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: EdgeInsets.symmetric(horizontal: screenSize.width * 0.04),
      child: Container(
        constraints: BoxConstraints(
          maxHeight: screenSize.height * 0.85,
          maxWidth: 500,
        ),
        decoration: BoxDecoration(
          color: theme.cardColor,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header with gradient
            Container(
              padding: EdgeInsets.all(screenSize.width * 0.05),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [theme.colorScheme.primary, theme.colorScheme.primary.withOpacity(0.7)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(24),
                  topRight: Radius.circular(24),
                ),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          Icons.receipt_long,
                          color: Colors.white,
                          size: screenSize.width * 0.07,
                        ),
                      ),
                      SizedBox(width: screenSize.width * 0.03),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Chi tiết đơn hàng',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: screenSize.width * 0.05,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Mã: $orderCode',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.9),
                                fontSize: screenSize.width * 0.035,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: () => Get.back(),
                        icon: const Icon(Icons.close, color: Colors.white),
                        iconSize: 28,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Content
            Flexible(
              child: SingleChildScrollView(
                padding: EdgeInsets.all(screenSize.width * 0.05),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Store Info Section
                    _buildSection(
                      screenSize,
                      theme,
                      icon: Icons.store,
                      title: 'Thông tin cửa hàng',
                      children: [
                        _buildInfoRow(
                          screenSize,
                          'Tên cửa hàng',
                          controller.getStoreName(storeId),
                          Icons.storefront,
                        ),
                        _buildInfoRow(
                          screenSize,
                          'Địa chỉ',
                          controller.getStoreAddress(storeId),
                          Icons.location_on,
                        ),
                      ],
                    ),

                    SizedBox(height: screenSize.height * 0.02),

                    // Order Info Section
                    _buildSection(
                      screenSize,
                      theme,
                      icon: Icons.info_outline,
                      title: 'Thông tin đơn hàng',
                      children: [
                        _buildInfoRow(
                          screenSize,
                          'Mã đơn',
                          orderCode ?? 'N/A',
                          Icons.qr_code,
                        ),
                        _buildInfoRow(
                          screenSize,
                          'Trạng thái thanh toán',
                          statusPayment == 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán',
                          Icons.payment,
                          valueColor: statusPayment == 'PAID' 
                              ? Colors.green.shade700 
                              : Colors.orange.shade700,
                        ),
                        _buildInfoRow(
                          screenSize,
                          'Tổng tiền',
                          controller.formatPrice(totalCost),
                          Icons.attach_money,
                          valueColor: theme.colorScheme.primary,
                          isBold: true,
                        ),
                        _buildInfoRow(
                          screenSize,
                          'Đánh giá',
                          isRated ? 'Đã đánh giá' : 'Chưa đánh giá',
                          Icons.star,
                        ),
                        if (createdAt != null)
                          _buildInfoRow(
                            screenSize,
                            'Ngày tạo',
                            _formatDateTime(createdAt),
                            Icons.calendar_today,
                          ),
                        if (updatedAt != null)
                          _buildInfoRow(
                            screenSize,
                            'Cập nhật lần cuối',
                            _formatDateTime(updatedAt),
                            Icons.update,
                          ),
                      ],
                    ),

                    SizedBox(height: screenSize.height * 0.02),

                    // Order Details Section
                    _buildSection(
                      screenSize,
                      theme,
                      icon: Icons.sports_soccer,
                      title: 'Chi tiết đặt sân (${orderDetails.length} khung giờ)',
                      children: orderDetails.asMap().entries.map((entry) {
                        final index = entry.key;
                        final detail = entry.value as Map<String, dynamic>;
                        return _buildOrderDetailCard(
                          screenSize,
                          theme,
                          index + 1,
                          detail,
                        );
                      }).toList(),
                    ),

                    SizedBox(height: screenSize.height * 0.01),
                  ],
                ),
              ),
            ),

            // Footer Actions
            Container(
              padding: EdgeInsets.all(screenSize.width * 0.04),
              decoration: BoxDecoration(
                color: theme.scaffoldBackgroundColor,
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(24),
                  bottomRight: Radius.circular(24),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, -2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => Get.back(),
                      icon: const Icon(Icons.close),
                      label: const Text('Đóng'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(
    Size screenSize,
    ThemeData theme, {
    required IconData icon,
    required String title,
    required List<Widget> children,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: theme.dividerColor.withOpacity(0.1),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsets.all(screenSize.width * 0.04),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    icon,
                    color: theme.colorScheme.primary,
                    size: 20,
                  ),
                ),
                SizedBox(width: screenSize.width * 0.03),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: screenSize.width * 0.042,
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          Padding(
            padding: EdgeInsets.all(screenSize.width * 0.04),
            child: Column(
              children: children,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(
    Size screenSize,
    String label,
    String value, 
    IconData icon, {
    Color? valueColor,
    bool isBold = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            size: 18,
            color: Colors.grey[600],
          ),
          SizedBox(width: screenSize.width * 0.03),
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: TextStyle(
                fontSize: screenSize.width * 0.036,
                color: Colors.grey[700],
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value,
              style: TextStyle(
                fontSize: screenSize.width * 0.038,
                fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
                color: valueColor ?? Colors.black87,
              ),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderDetailCard(
    Size screenSize,
    ThemeData theme,
    int index,
    Map<String, dynamic> detail,
  ) {
    final fieldId = detail['fieldId'] as String?;
    final startTime = detail['startTime'] as String?;
    final endTime = detail['endTime'] as String?;
    final price = detail['price'] as int? ?? 0;

    final fieldInfo = controller.getFieldInfo(fieldId);
    final fieldName = fieldInfo?['name'] ?? 'Đang tải...';

    // Parse time
    DateTime? start;
    DateTime? end;
    try {
      if (startTime != null) {
        start = DateTime.parse(startTime.replaceAll(' ', 'T'));
      }
      if (endTime != null) {
        end = DateTime.parse(endTime.replaceAll(' ', 'T'));
      }
    } catch (_) {}

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: EdgeInsets.all(screenSize.width * 0.035),
      decoration: BoxDecoration(
        color: theme.colorScheme.primary.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: theme.colorScheme.primary.withOpacity(0.2),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  '#$index',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: screenSize.width * 0.032,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              SizedBox(width: screenSize.width * 0.025),
              Expanded(
                child: Text(
                  fieldName,
                  style: TextStyle(
                    fontSize: screenSize.width * 0.04,
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.primary,
                  ),
                ),
              ),
              Text(
                controller.formatPrice(price),
                style: TextStyle(
                  fontSize: screenSize.width * 0.038,
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.primary,
                ),
              ),
            ],
          ),
          SizedBox(height: screenSize.height * 0.01),
          Row(
            children: [
              Icon(
                Icons.access_time,
                size: 16,
                color: Colors.grey[600],
              ),
              SizedBox(width: screenSize.width * 0.02),
              Text(
                start != null && end != null
                    ? '${_formatTime(start)} - ${_formatTime(end)}'
                    : 'N/A',
                style: TextStyle(
                  fontSize: screenSize.width * 0.036,
                  color: Colors.grey[700],
                ),
              ),
              SizedBox(width: screenSize.width * 0.03),
              Icon(
                Icons.calendar_today,
                size: 16,
                color: Colors.grey[600],
              ),
              SizedBox(width: screenSize.width * 0.02),
              Text(
                start != null ? controller.formatDate(start) : 'N/A',
                style: TextStyle(
                  fontSize: screenSize.width * 0.036,
                  color: Colors.grey[700],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _formatDateTime(String dateTimeStr) {
    try {
      final dateTime = DateTime.parse(dateTimeStr);
      return '${dateTime.day.toString().padLeft(2, '0')}/${dateTime.month.toString().padLeft(2, '0')}/${dateTime.year} ${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return 'N/A';
    }
  }

  String _formatTime(DateTime time) {
    return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
  }
}