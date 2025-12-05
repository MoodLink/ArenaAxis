import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/services/bill_service.dart';
import 'package:mobile/utilities/token_storage.dart';
import 'package:mobile/widgets/loading.dart';

class BookingsController extends GetxController {
  final BookingsService _service = BookingsService();

  // Observable lists - giờ mỗi item đại diện cho 1 ngày của order
  final upcomingOrders = <Map<String, dynamic>>[].obs;
  final pastOrders = <Map<String, dynamic>>[].obs;

  // Cache để lưu thông tin store và field
  final Map<String, Map<String, dynamic>> _storeCache = {};
  final Map<String, Map<String, dynamic>> _fieldCache = {};

  // Loading state
  final isLoading = true.obs;

  // Error message
  final errorMessage = Rxn<String>();
  final tokenStorage = TokenStorage(storage: const FlutterSecureStorage());

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
      
      User? user = await tokenStorage.getUserData();
      
      if (user == null) {
        throw Exception('Không tìm thấy thông tin người dùng.');
      }

      final response = await _service.getUserOrders(user.id);
      final List<dynamic> orders = response['data'] ?? [];

      _classifyOrders(orders);

      // Fetch thông tin store và field cho các orders
      await _fetchAdditionalInfo();
    
      isLoading.value = false;
    } catch (e) {
      errorMessage.value = e.toString().contains('Exception:') 
          ? e.toString().replaceAll('Exception: ', '')
          : 'Lỗi không xác định: $e';
      isLoading.value = false;
    }
  }

  /// Phân loại orders - tách orderDetails theo ngày
  void _classifyOrders(List<dynamic> orders) {
    final now = DateTime.now();
    final upcoming = <Map<String, dynamic>>[];
    final past = <Map<String, dynamic>>[];

    for (var order in orders) {
      final orderMap = order as Map<String, dynamic>;
      final orderDetails = orderMap['orderDetails'] as List<dynamic>? ?? [];

      if (orderDetails.isEmpty) {
        continue;
      }

      // Nhóm orderDetails theo ngày
      final Map<String, List<Map<String, dynamic>>> groupedByDate = {};

      for (var detail in orderDetails) {
        final detailMap = detail as Map<String, dynamic>;
        final startTimeStr = detailMap['startTime'] as String? ?? '';
        
        try {
          final startTime = DateTime.parse(startTimeStr.replaceAll(' ', 'T'));
          final dateKey = '${startTime.year}-${startTime.month.toString().padLeft(2, '0')}-${startTime.day.toString().padLeft(2, '0')}';
          
          if (!groupedByDate.containsKey(dateKey)) {
            groupedByDate[dateKey] = [];
          }
          groupedByDate[dateKey]!.add(detailMap);
        } catch (_) {
          // Bỏ qua detail không hợp lệ
        }
      }

      // Tạo order riêng cho mỗi ngày
      for (var entry in groupedByDate.entries) {
        final dateKey = entry.key;
        final detailsForDate = entry.value;

        // Tính thời gian kết thúc muộn nhất của ngày này
        DateTime? latestEndTime;
        int totalCost = 0;

        for (var detail in detailsForDate) {
          final endTimeStr = detail['endTime'] as String? ?? '';
          try {
            final endTime = DateTime.parse(endTimeStr.replaceAll(' ', 'T'));
            if (latestEndTime == null || endTime.isAfter(latestEndTime)) {
              latestEndTime = endTime;
            }
          } catch (_) {}

          totalCost += (detail['price'] as int? ?? 0);
        }

        if (latestEndTime == null) continue;

        // Tạo order mới cho ngày này
        final dayOrder = {
          '_id': orderMap['_id'], // Giữ nguyên ID gốc để hủy/thanh toán
          'originalOrderCode': orderMap['orderCode'], // Mã đơn gốc
          'orderCode': '${orderMap['orderCode']}-$dateKey', // Mã đơn + ngày để phân biệt
          'userId': orderMap['userId'],
          'storeId': orderMap['storeId'],
          'statusPayment': orderMap['statusPayment'],
          'cost': totalCost, // Tổng tiền của ngày này
          'isRated': orderMap['isRated'],
          'createdAt': orderMap['createdAt'],
          'updatedAt': orderMap['updatedAt'],
          'orderDetails': detailsForDate, // Chỉ chứa details của ngày này
          'displayDate': dateKey, // Để dễ hiển thị
        };

        // Phân loại theo thời gian kết thúc
        if (latestEndTime.isAfter(now)) {
          upcoming.add(dayOrder);
        } else {
          past.add(dayOrder);
        }
      }
    }

    // Sắp xếp
    upcoming.sort((a, b) {
      final aStart = getEarliestStartTime(a);
      final bStart = getEarliestStartTime(b);
      if (aStart == null || bStart == null) return 0;
      return aStart.compareTo(bStart);
    });

    past.sort((a, b) {
      final aEnd = getLatestEndTime(a);
      final bEnd = getLatestEndTime(b);
      if (aEnd == null || bEnd == null) return 0;
      return bEnd.compareTo(aEnd);
    });

    upcomingOrders.assignAll(upcoming);
    pastOrders.assignAll(past);
  }

  /// Lấy thời gian bắt đầu sớm nhất
  DateTime? getEarliestStartTime(Map<String, dynamic> order) {
    DateTime? earliest;
    final orderDetails = order['orderDetails'] as List<dynamic>? ?? [];

    for (var detail in orderDetails) {
      final startTimeStr = (detail as Map<String, dynamic>)['startTime'] as String? ?? '';
      
      try {
        final startTime = DateTime.parse(startTimeStr.replaceAll(' ', 'T'));
        if (earliest == null || startTime.isBefore(earliest)) {
          earliest = startTime;
        }
      } catch (_) {}
    }
    return earliest;
  }

  /// Lấy thời gian kết thúc muộn nhất
  DateTime? getLatestEndTime(Map<String, dynamic> order) {
    DateTime? latest;
    final orderDetails = order['orderDetails'] as List<dynamic>? ?? [];

    for (var detail in orderDetails) {
      final endTimeStr = (detail as Map<String, dynamic>)['endTime'] as String? ?? '';
      
      try {
        final endTime = DateTime.parse(endTimeStr.replaceAll(' ', 'T'));
        if (latest == null || endTime.isAfter(latest)) {
          latest = endTime;
        }
      } catch (_) {}
    }
    return latest;
  }

  // --- Các hàm Format ---

  /// Format ngày
  String formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }

  /// Format thời gian - giờ trong cùng ngày
  String formatTime(DateTime start, DateTime end) {
    final startFormatted = '${start.hour.toString().padLeft(2, '0')}:${start.minute.toString().padLeft(2, '0')}';
    final endFormatted = '${end.hour.toString().padLeft(2, '0')}:${end.minute.toString().padLeft(2, '0')}';
    return '$startFormatted - $endFormatted';
  }

  /// Format giá tiền (VD: 1.000.000đ)
  String formatPrice(int price) {
    return '${price.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}đ';
  }

  // --- Các hành động ---

  /// Hủy đơn - hủy toàn bộ order gốc
  Future<void> cancelOrder(String orderId) async {
    try {
      Get.dialog(loadingIndicator(), barrierDismissible: false);

      await _service.cancelOrder(orderId);

      Get.back();

      Get.snackbar(
        'Thành công',
        'Đã hủy đơn đặt sân thành công.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.primary,
        colorText: Get.theme.colorScheme.onPrimary,
      );

      await fetchOrders();
    } catch (e) {
      Get.back();

      Get.snackbar(
        'Lỗi hủy đơn',
        e.toString().replaceAll('Exception: ', ''),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.error,
        colorText: Get.theme.colorScheme.onError,
      );
    }
  }

  /// Thanh toán - thanh toán toàn bộ order gốc
  Future<void> payOrder(String orderId) async {
    try {
      Get.dialog(loadingIndicator(), barrierDismissible: false);

      await _service.payOrder(orderId);

      Get.back();

      Get.snackbar(
        'Thành công',
        'Thanh toán thành công. Đơn hàng đã được cập nhật.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.primary,
        colorText: Get.theme.colorScheme.onPrimary,
      );

      await fetchOrders();
    } catch (e) {
      Get.back();

      Get.snackbar(
        'Lỗi thanh toán',
        e.toString().replaceAll('Exception: ', ''),
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

  /// Fetch thông tin store và field cho các orders
  Future<void> _fetchAdditionalInfo() async {
    final allOrders = [...upcomingOrders, ...pastOrders];
    
    for (var order in allOrders) {
      // Fetch store info
      final storeId = order['storeId'] as String?;
      if (storeId != null && !_storeCache.containsKey(storeId)) {
        try {
          final storeInfo = await _service.getStoreDetail(storeId);
          _storeCache[storeId] = storeInfo;
        } catch (e) {
          // Bỏ qua lỗi khi fetch store, không ảnh hưởng đến UI chính
        }
      }

      // Fetch field info cho tất cả orderDetails
      final orderDetails = order['orderDetails'] as List<dynamic>? ?? [];
      for (var detail in orderDetails) {
        final fieldId = (detail as Map<String, dynamic>)['fieldId'] as String?;
        if (fieldId != null && !_fieldCache.containsKey(fieldId)) {
          try {
            final fieldInfo = await _service.getFieldDetail(fieldId);
            _fieldCache[fieldId] = fieldInfo['data'] ?? {};
          } catch (e) {
            // Bỏ qua lỗi khi fetch field
          }
        }
      }
    }

    // Trigger update UI
    upcomingOrders.refresh();
    pastOrders.refresh();
  }

  /// Lấy thông tin store từ cache
  Map<String, dynamic>? getStoreInfo(String? storeId) {
    if (storeId == null) return null;
    return _storeCache[storeId];
  }

  /// Lấy thông tin field từ cache
  Map<String, dynamic>? getFieldInfo(String? fieldId) {
    if (fieldId == null) return null;
    return _fieldCache[fieldId];
  }

  /// Lấy tên store
  String getStoreName(String? storeId) {
    final store = getStoreInfo(storeId);
    return store?['name'] ?? 'Đang tải...';
  }

  /// Lấy địa chỉ store
  String getStoreAddress(String? storeId) {
    final store = getStoreInfo(storeId);
    return store?['address'] ?? '';
  }

  /// Lấy avatar URL của store
  String? getStoreAvatarUrl(String? storeId) {
    final store = getStoreInfo(storeId);
    return store?['avatarUrl'];
  }

  /// Lấy tên các sân trong order
  String getFieldNames(Map<String, dynamic> order) {
    final orderDetails = order['orderDetails'] as List<dynamic>? ?? [];
    final fieldNames = <String>{};

    for (var detail in orderDetails) {
      final fieldId = (detail as Map<String, dynamic>)['fieldId'] as String?;
      final fieldInfo = getFieldInfo(fieldId);
      if (fieldInfo != null) {
        fieldNames.add(fieldInfo['name'] ?? 'Sân');
      }
    }

    if (fieldNames.isEmpty) return 'Đang tải...';
    return fieldNames.join(', ');
  }
}