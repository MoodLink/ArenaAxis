import 'dart:convert';
import 'dart:developer';
import 'package:get/get.dart';
import 'package:intl/intl.dart';

import 'package:mobile/models/FieldPrincing.dart';
import 'package:mobile/models/cart_item.dart';
import 'package:mobile/models/field.dart';

import 'package:mobile/services/field_service.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/widgets/payement_web.dart';

class FieldController extends GetxController {
  final FieldService _service = FieldService();

  var fields = <FieldModel>[].obs;
  var isLoading = true.obs;
  var selectedSlotKeys = <String>{}.obs;
  var selectedSlotsDetail = <String, SelectedSlot>{}.obs;
  var selectedDate = DateTime.now().obs;

  String? currentStoreId;
  String? currentSportId;

  var fieldPricingConfig = <String, FieldPricingResponse>{}.obs;
  var selectedSlotIds = <String>{}.obs;

  @override
  void onInit() {
    super.onInit();
    ever(selectedDate, (_) {
      if (currentStoreId != null && currentSportId != null) {
        // KHÔNG selectedSlotIds.clear() nữa
        loadData(currentStoreId!, currentSportId!);
      }
    });
  }

  Future<void> loadData(String storeId, String sportId) async {
    currentStoreId = storeId;
    currentSportId = sportId;
    isLoading.value = true;
    try {
      var fetchedFields = await _service.getFields(
        storeId,
        sportId,
        selectedDate.value,
      );
      fields.value = fetchedFields;

      for (var field in fetchedFields) {
        if (!fieldPricingConfig.containsKey(field.id)) {
          var pricing = await _service.getFieldPricing(field.id);
          if (pricing != null) {
            fieldPricingConfig[field.id] = pricing;
          }
        }
      }
    } catch (e) {
      log("Error loading data: $e");
    } finally {
      isLoading.value = false;
    }
  }

  bool isSlotSelected(String fieldId, String timeSlot) {
    String date = DateFormat("yyyy-MM-dd").format(selectedDate.value);
    String key = "${date}_${fieldId}_$timeSlot";
    return selectedSlotKeys.contains(key);
  }

  bool isSlotBooked(String fieldId, String timeSlot) {
    var field = fields.firstWhereOrNull((f) => f.id == fieldId);
    if (field == null || field.bookedSlots.isEmpty) return false;

    double slotVal = _timeToDouble(timeSlot);

    for (var booking in field.bookedSlots) {
      double start = _timeToDouble(booking.startTime);
      double end = _timeToDouble(booking.endTime);
      if (slotVal >= start && slotVal < end) {
        return true;
      }
    }
    return false;
  }

  bool isSpecialPrice(String fieldId, String timeSlot) {
    var config = fieldPricingConfig[fieldId];
    if (config == null) return false;

    String dayKey = _getDayKey(selectedDate.value);
    if (config.pricings.containsKey(dayKey)) {
      List<PricingDetail> specialPricings = config.pricings[dayKey]!;
      for (var p in specialPricings) {
        if (_isTimeInSlot(timeSlot, p.startAt, p.endAt)) {
          return true;
        }
      }
    }
    return false;
  }

  double getPriceForTimeSlot(String fieldId, String timeSlot) {
    var field = fields.firstWhereOrNull((f) => f.id == fieldId);
    double finalPrice = field?.defaultPrice ?? 0.0;

    var config = fieldPricingConfig[fieldId];
    if (config == null) {
      return finalPrice;
    }

    String dayKey = _getDayKey(selectedDate.value);
    if (config.pricings.containsKey(dayKey)) {
      List<PricingDetail> specialPricings = config.pricings[dayKey]!;
      for (var p in specialPricings) {
        if (_isTimeInSlot(timeSlot, p.startAt, p.endAt)) {
          finalPrice = p.specialPrice;
          break;
        }
      }
    }
    return finalPrice;
  }

  String _getDayKey(DateTime date) {
    List<String> days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    return days[date.weekday - 1];
  }

  bool _isTimeInSlot(String timeToCheck, String start, String end) {
    double check = _timeToDouble(timeToCheck);
    double s = _timeToDouble(start);
    double e = _timeToDouble(end);
    return check >= s && check < e;
  }

  double _timeToDouble(String time) {
    try {
      if (time.isEmpty) return 0;
      var parts = time.split(":");
      if (parts.length < 2) return 0;
      double h = double.parse(parts[0]);
      double m = double.parse(parts[1]);
      return h + m / 60.0;
    } catch (e) {
      log("Error parsing time: $time -> $e");
      return 0;
    }
  }

  void toggleSlot(String fieldId, String time, String fieldName) {
    String date = DateFormat("yyyy-MM-dd").format(selectedDate.value);
    String key = "${date}_${fieldId}_$time";

    if (selectedSlotKeys.contains(key)) {
      selectedSlotKeys.remove(key);
      selectedSlotsDetail.remove(key);
    } else {
      selectedSlotKeys.add(key);
      selectedSlotsDetail[key] = SelectedSlot(
        fieldId: fieldId,
        date: date,
        startTime: time,
        fieldName: fieldName,
      );
    }
  }

  double get totalPrice {
    double total = 0;
    for (var slotDetail in selectedSlotsDetail.values) {
      // Giá vẫn phụ thuộc vào fieldId và startTime
      total += getPriceForTimeSlot(slotDetail.fieldId, slotDetail.startTime);
    }
    return total;
  }

  void clearAllSlots() {
    selectedSlotKeys.clear();
    selectedSlotsDetail.clear();
  }

  String formatCurrency(double amount) {
    return NumberFormat.currency(
      locale: 'vi_VN',
      symbol: 'đ',
      decimalDigits: 0,
    ).format(amount);
  }

  List<String> generateTimeSlots() {
    List<String> slots = [];
    for (int i = 5; i < 23; i++) {
      slots.add("${i.toString().padLeft(2, '0')}:00");
      slots.add("${i.toString().padLeft(2, '0')}:30");
    }
    return slots;
  }

  Future<void> createPaymentOrder() async {
    final url = "https://arena-axis.vercel.app/api/v1/orders/create-payment";
    List<Map<String, dynamic>> items = [];

    // Duyệt qua tất cả các slot đã chọn (kể cả các ngày khác)
    for (var slot in selectedSlotsDetail.values) {
      DateTime t = DateFormat("HH:mm").parse(slot.startTime);
      String endTime = DateFormat(
        "HH:mm",
      ).format(t.add(const Duration(minutes: 30)));
      // PHẢI sử dụng getPriceForTimeSlot vì giá có thể thay đổi theo ngày/giờ
      double price = getPriceForTimeSlot(slot.fieldId, slot.startTime);

      items.add({
        "field_id": slot.fieldId,
        "start_time": slot.startTime,
        "end_time": endTime,
        "date": slot.date, // THÊM TRƯỜNG DATE
        "name": slot.fieldName,
        "quantity": 1,
        "price": price.round(),
      });
    }

    if (items.isEmpty) {
      Get.snackbar(
        "Cảnh báo",
        "Vui lòng chọn ít nhất một khung giờ để thanh toán.",
      );
      return;
    }

    // Lấy ngày sớm nhất và muộn nhất đã chọn để làm description (tùy chọn)
    // Hoặc chỉ cần thông báo số lượng slot đã chọn.
    String description = "Đặt ${items.length} slot cho sân ${currentSportId!}";

    Map<String, dynamic> body = {
      "store_id": currentStoreId,
      "user_id": "", // Cần điền userId thực tế
      "amount": totalPrice.round(),
      "description": description,
      "date": DateFormat(
        "yyyy-MM-dd",
      ).format(DateTime.now()), // Có thể giữ nguyên ngày hiện tại hoặc bỏ
      "items": items,
    };
    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(body),
      );

      var data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        if (data["data"] != null && data["data"]["checkoutUrl"] != null) {
          String checkoutUrl = data["data"]["checkoutUrl"];
          Get.to(() => PaymentWebView(url: checkoutUrl));
        } else {
          Get.snackbar(
            "Lỗi",
            "Không lấy được link thanh toán",
            snackPosition: SnackPosition.BOTTOM,
          );
        }
      } else {
        String errorMessage = data['message'] ?? "Lỗi không xác định.";
        Get.snackbar(
          "Tạo đơn thất bại",
          "$errorMessage (Code: ${response.statusCode})",
          snackPosition: SnackPosition.BOTTOM,
        );
      }
    } catch (e) {
      log("Payment exception: $e");
      Get.snackbar(
        "Lỗi kết nối",
        "Không thể kết nối đến máy chủ thanh toán.",
        snackPosition: SnackPosition.BOTTOM,
      );
    }
  }

  List<Map<String, String>> get cartDetails {
    if (selectedSlotsDetail.isEmpty) {
      return [];
    }

    Map<String, List<SelectedSlot>> groupedSlots = {};

    for (var slotDetail in selectedSlotsDetail.values) {
      String key = "${slotDetail.fieldId}_${slotDetail.date}";
      if (!groupedSlots.containsKey(key)) {
        groupedSlots[key] = [];
      }
      groupedSlots[key]!.add(slotDetail);
    }

    List<Map<String, String>> finalCartDetails = [];

    groupedSlots.forEach((key, slots) {
      slots.sort((a, b) => a.startTime.compareTo(b.startTime));

      double totalGroupPrice = 0.0;
      for (var slot in slots) {
        DateTime slotDateTime = DateFormat("yyyy-MM-dd").parse(slot.date);
        totalGroupPrice += getPriceForSlot(
          slot.fieldId,
          slot.startTime,
          slotDateTime,
        );
      }

      List<String> timeRanges = [];
      String? currentRangeStart;
      DateTime? currentRangeEnd;

      for (int i = 0; i < slots.length; i++) {
        DateTime startTime = DateFormat("HH:mm").parse(slots[i].startTime);
        DateTime endTime = startTime.add(const Duration(minutes: 30));

        if (currentRangeStart == null) {
          currentRangeStart = slots[i].startTime;
          currentRangeEnd = endTime;
        } else if (startTime.isAtSameMomentAs(currentRangeEnd!)) {
          currentRangeEnd = endTime;
        } else {
          timeRanges.add(
            "$currentRangeStart-${DateFormat("HH:mm").format(currentRangeEnd!)}",
          );
          currentRangeStart = slots[i].startTime;
          currentRangeEnd = endTime;
        }
      }

      if (currentRangeStart != null && currentRangeEnd != null) {
        timeRanges.add(
          "$currentRangeStart-${DateFormat("HH:mm").format(currentRangeEnd)}",
        );
      }

      DateTime slotDate = DateFormat("yyyy-MM-dd").parse(slots.first.date);
      String formattedDate = DateFormat(
        'EEEE, dd/MM/yyyy',
        'vi_VN',
      ).format(slotDate);

      finalCartDetails.add({
        'fieldName': slots.first.fieldName,
        'date': formattedDate,
        'timeSlot': timeRanges.join(', '),
        'price': formatCurrency(totalGroupPrice),
        'fieldId': slots.first.fieldId,
        'key': key,
        'slotCount': slots.length.toString(),
      });
    });

    return finalCartDetails;
  }
  // Đặt hàm này trong class FieldController của bạn

double getPriceForSlot(String fieldId, String timeSlot, DateTime date) {
    var field = fields.firstWhereOrNull((f) => f.id == fieldId);
    double finalPrice = field?.defaultPrice ?? 0.0;

    var config = fieldPricingConfig[fieldId];
    if (config == null) {
      return finalPrice;
    }

    String dayKey = _getDayKey(date); // SỬ DỤNG NGÀY ĐƯỢC TRUYỀN VÀO (slot date)
    if (config.pricings.containsKey(dayKey)) {
      List<PricingDetail> specialPricings = config.pricings[dayKey]!;
      for (var p in specialPricings) {
        if (_isTimeInSlot(timeSlot, p.startAt, p.endAt)) {
          finalPrice = p.specialPrice;
          break;
        }
      }
    }
    return finalPrice;
}
// Đặt hàm này trong class FieldController của bạn

void removeGroupedSlots(String groupKey) {
  // Tìm tất cả các key slot (yyyy-MM-dd_fieldId_time) thuộc nhóm này
  // groupKey: fieldId_date (ví dụ: 'F001_2025-12-05')
  
  // 1. Lọc các keys slot cần xóa
  List<String> keysToRemove = selectedSlotKeys.where((key) {
    // Key slot có dạng: '2025-12-05_F001_08:00'
    // Ta cần kiểm tra xem phần fieldId_date có khớp với groupKey không.
    
    // Tách key slot: [date, fieldId, time]
    List<String> parts = key.split('_');
    if (parts.length < 3) return false;
    
    // Ghép lại thành 'fieldId_date' để so sánh với groupKey
    String slotGroupKey = "${parts[1]}_${parts[0]}"; 
    
    return slotGroupKey == groupKey;
  }).toList();
  
  // 2. Xóa các keys và details
  for (String key in keysToRemove) {
    selectedSlotKeys.remove(key);
    selectedSlotsDetail.remove(key);
  }
}
}
