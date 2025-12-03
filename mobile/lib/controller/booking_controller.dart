import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/services/bill_service.dart';
import 'package:mobile/widgets/loading.dart';


class BookingsController extends GetxController {
  final BookingsService _service = BookingsService();

  // Observable lists
  final upcomingOrders = <Map<String, dynamic>>[].obs;
  final pastOrders = <Map<String, dynamic>>[].obs;
  
  // Loading state
  final isLoading = true.obs;
  
  // Error message
  final errorMessage = Rxn<String>();
  
  // User ID - có thể lấy từ AuthController
  static const String userId = '0cb620b5-c005-468b-934e-044324a5863e';

  @override
  void onInit() {
    super.onInit();
    fetchOrders();
  }

  /// Lấy danh sách orders
  Future<void> fetchOrders() async {
    try {
      isLoading.value = true;
      errorMessage.value = null;

      final response = await _service.getUserOrders(userId);
      final List<dynamic> orders = response['data'];
      
      _classifyOrders(orders);
      
      isLoading.value = false;
    } catch (e) {
      errorMessage.value = e.toString();
      isLoading.value = false;
    }
  }

  /// Phân loại orders theo thời gian
  void _classifyOrders(List<dynamic> orders) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);

    List<Map<String, dynamic>> upcoming = [];
    List<Map<String, dynamic>> past = [];

    for (var order in orders) {
      final earliestStartTime = getEarliestStartTime(order);

      if (earliestStartTime != null) {
        final startDate = DateTime(
          earliestStartTime.year,
          earliestStartTime.month,
          earliestStartTime.day,
        );

        if (startDate.isAtSameMomentAs(today) || startDate.isAfter(today)) {
          upcoming.add(order as Map<String, dynamic>);
        } else {
          past.add(order as Map<String, dynamic>);
        }
      }
    }

    // Sắp xếp
    upcoming.sort((a, b) => getEarliestStartTime(a)!.compareTo(getEarliestStartTime(b)!));
    past.sort((a, b) => getEarliestStartTime(b)!.compareTo(getEarliestStartTime(a)!));

    upcomingOrders.value = upcoming;
    pastOrders.value = past;
  }

  /// Lấy thời gian bắt đầu sớm nhất
  DateTime? getEarliestStartTime(Map<String, dynamic> order) {
    DateTime? earliest;
    final orderDetails = order['orderDetails'] as List<dynamic>;
    
    for (var detail in orderDetails) {
      final startTimeStr = detail['startTime'] as String;
      final startTime = DateTime.parse(startTimeStr.replaceAll(' ', 'T'));
      if (earliest == null || startTime.isBefore(earliest)) {
        earliest = startTime;
      }
    }
    return earliest;
  }

  /// Lấy thời gian kết thúc muộn nhất
  DateTime? getLatestEndTime(Map<String, dynamic> order) {
    DateTime? latest;
    final orderDetails = order['orderDetails'] as List<dynamic>;
    
    for (var detail in orderDetails) {
      final endTimeStr = detail['endTime'] as String;
      final endTime = DateTime.parse(endTimeStr.replaceAll(' ', 'T'));
      if (latest == null || endTime.isAfter(latest)) {
        latest = endTime;
      }
    }
    return latest;
  }

  /// Format ngày
  String formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }

  /// Format thời gian
  String formatTime(DateTime start, DateTime end) {
    return '${start.hour.toString().padLeft(2, '0')}:${start.minute.toString().padLeft(2, '0')} - ${end.hour.toString().padLeft(2, '0')}:${end.minute.toString().padLeft(2, '0')}';
  }

  /// Format giá tiền
  String formatPrice(int price) {
    return '${price.toString().replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), 
      (Match m) => '${m[1]}.'
    )}đ';
  }

  /// Hủy đơn
  Future<void> cancelOrder(String orderId) async {
    try {
      Get.dialog(
        const Center(child: CircularProgressIndicator()),
        barrierDismissible: false,
      );

      await _service.cancelOrder(orderId);
      
      Get.back(); // Đóng dialog loading
      
      Get.snackbar(
        'Thành công',
        'Đã hủy đơn đặt sân',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.primary,
        colorText: Get.theme.colorScheme.onPrimary,
      );

      // Reload danh sách
      await fetchOrders();
    } catch (e) {
      Get.back(); // Đóng dialog loading
      
      Get.snackbar(
        'Lỗi',
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.error,
        colorText: Get.theme.colorScheme.onError,
      );
    }
  }

  /// Thanh toán
  Future<void> payOrder(String orderId) async {
    try {
      Get.dialog(
        loadingIndicator(),
        barrierDismissible: false,
      );

      await _service.payOrder(orderId);
      
      Get.back(); // Đóng dialog loading
      
      Get.snackbar(
        'Thành công',
        'Thanh toán thành công',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.primary,
        colorText: Get.theme.colorScheme.onPrimary,
      );

      // Reload danh sách
      await fetchOrders();
    } catch (e) {
      Get.back(); // Đóng dialog loading
      
      Get.snackbar(
        'Lỗi',
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.error,
        colorText: Get.theme.colorScheme.onError,
      );
    }
  }

  /// Thử lại khi có lỗi
  void retry() {
    fetchOrders();
  }
}