import 'dart:convert';
import 'dart:developer';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/models/cart_item.dart';
import 'package:mobile/models/field.dart';
import 'package:mobile/screens/login_screen.dart';
import 'package:mobile/services/field_service.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/utilities/token_storage.dart';
import 'package:mobile/widgets/payment_web.dart';
import 'package:mobile/widgets/show_login_required_dialog.dart';

class FieldController extends GetxController {
  final FieldService _service = FieldService();

  var fields = <FieldModel>[].obs;
  var isLoading = true.obs;
  var selectedSlotKeys = <String>{}.obs;
  var selectedSlotsDetail = <String, SelectedSlot>{}.obs;
  var selectedDate = DateTime.now().obs;

  String? currentStoreId;
  String? currentSportId;

  @override
  void onInit() {
    super.onInit();
    ever(selectedDate, (_) {
      if (currentStoreId != null && currentSportId != null) {
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

    DateTime slotDate = selectedDate.value;
    String slotStartStr =
        "${DateFormat('yyyy-MM-dd').format(slotDate)}T${timeSlot}:00.000Z";
    DateTime slotStart = DateTime.parse(slotStartStr).toUtc();
    DateTime slotEnd = slotStart.add(const Duration(minutes: 30));

    for (var booking in field.bookedSlots) {
      if (booking.statusPayment == "FAILED") continue;
      DateTime bookStart = DateTime.parse(booking.startTime);
      DateTime bookEnd = DateTime.parse(booking.endTime);
      if (slotStart.isBefore(bookEnd) && slotEnd.isAfter(bookStart)) {
        return true;
      }
    }
    return false;
  }

  bool isSpecialPrice(String fieldId, String timeSlot) {
    var field = fields.firstWhereOrNull((f) => f.id == fieldId);
    if (field == null || field.pricings.isEmpty) return false;
    for (var p in field.pricings) {
      if (_isTimeInSlot(timeSlot, p.startAt, p.endAt)) return true;
    }
    return false;
  }

  double getPriceForTimeSlot(String fieldId, String timeSlot) {
    var field = fields.firstWhereOrNull((f) => f.id == fieldId);
    double price = field?.defaultPrice ?? 0.0;
    if (field == null || field.pricings.isEmpty) return price;

    for (var p in field.pricings) {
      if (_isTimeInSlot(timeSlot, p.startAt, p.endAt)) {
        price = p.specialPrice;
        break;
      }
    }
    return price;
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
      double h = double.parse(parts[0]);
      double m = double.parse(parts[1]);
      return h + m / 60.0;
    } catch (e) {
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
      double price = getPriceForTimeSlot(fieldId, time);
      selectedSlotKeys.add(key);
      selectedSlotsDetail[key] = SelectedSlot(
        fieldId: fieldId,
        date: date,
        startTime: time,
        fieldName: fieldName,
        price: price,
      );
    }
  }

  double get totalPrice {
    return selectedSlotsDetail.values.fold(0, (sum, e) => sum + e.price);
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

  /// TRẢ VỀ 'success' | 'failed' | 'cancel' | null
  Future<String?> createPaymentOrder() async {
    {
      if (selectedSlotsDetail.isEmpty) {
        Get.snackbar("Cảnh báo", "Vui lòng chọn ít nhất một khung giờ");
        return null;
      }

      final url = "http://www.executexan.store/api/v1/orders/create-payment";
      final tokenStorage = TokenStorage(storage: const FlutterSecureStorage());

      dynamic userData = await tokenStorage.getUserData();

      if (userData == null) {
        showLoginRequiredDialog(Get.context!);
        return null;
      }
      User user = await tokenStorage.getUserData() as User;
      List<Map<String, dynamic>> items = [];
      for (var slot in selectedSlotsDetail.values) {
        DateTime t = DateFormat("HH:mm").parse(slot.startTime);
        String endTime = DateFormat(
          "HH:mm",
        ).format(t.add(const Duration(minutes: 30)));

        items.add({
          "field_id": slot.fieldId,
          "start_time": slot.startTime,
          "end_time": endTime,
          "date": slot.date,
          "name": slot.fieldName,
          "quantity": 1,
          "price": slot.price.round(),
        });
      }

      Map<String, dynamic> body = {
        "store_id": currentStoreId,
        "user_id": user.id,
        "amount": totalPrice.round(),
        "description": "Đặt ${items.length} slot sân $currentSportId",
        "items": items,
      };

      try {
        final response = await http.post(
          Uri.parse(url),
          headers: {"Content-Type": "application/json"},
          body: jsonEncode(body),
        );

        var data = jsonDecode(response.body);

        if (response.statusCode == 200 &&
            data["data"]?["checkoutUrl"] != null) {
          String checkoutUrl = data["data"]["checkoutUrl"];

          // Đợi kết quả từ WebView
          final result = await Get.to<String>(
            () => PaymentWebView(url: checkoutUrl),
          );

          return result; // 'success', 'failed', 'cancel'
        } else {
          String msg = data['message'] ?? "Lỗi tạo đơn hàng";
          Get.snackbar("Thất bại", msg);
          return null;
        }
      } catch (e) {
        log("Payment error: $e");
        Get.snackbar("Lỗi", "Không kết nối được máy chủ");
        return null;
      }
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

      double totalGroupPrice = slots.fold(0.0, (sum, slot) => sum + slot.price);

      List<String> timeRanges = [];
      String? currentRangeStart;
      DateTime? currentRangeEnd;

      for (int i = 0; i < slots.length; i++) {
        DateTime startTime = DateFormat("HH:mm").parse(slots[i].startTime);
        DateTime endTime = startTime.add(const Duration(minutes: 30));

        if (currentRangeStart == null) {
          currentRangeStart = slots[i].startTime;
          currentRangeEnd = endTime;
        } else if (startTime == currentRangeEnd) {
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

  void removeGroupedSlots(String groupKey) {
    List<String> keysToRemove = selectedSlotKeys.where((key) {
      List<String> parts = key.split('_');
      if (parts.length < 3) return false;
      String slotGroupKey = "${parts[1]}_${parts[0]}";
      return slotGroupKey == groupKey;
    }).toList();

    for (String key in keysToRemove) {
      selectedSlotKeys.remove(key);
      selectedSlotsDetail.remove(key);
    }
  }
}
