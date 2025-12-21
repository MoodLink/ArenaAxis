import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:mobile/controller/field_controller.dart';
import 'package:mobile/models/Store.dart';
import 'package:mobile/models/field.dart';
import 'package:mobile/widgets/cart_display.dart';

class StoreDetailScreen extends StatelessWidget {
  final Store store;
  final String sportCategory;

  const StoreDetailScreen({
    super.key,
    required this.store,
    required this.sportCategory,
  });

  // ----------------- ICON MAPPING THEO SPORT -----------------
  IconData getIconById(String id) {
    switch (id) {
      case 'football':
        return Icons.sports_soccer;
      case 'basketball':
        return Icons.sports_basketball;
      case 'badminton':
      case 'tennis':
        return Icons.sports_tennis;
      case 'pingpong':
        return Icons.sports_tennis_sharp;
      case 'volleyball':
        return Icons.sports_volleyball;
      case 'pickleball':
        return Icons.sports_tennis_sharp;
      case 'batminton':
        return Icons.sports_cricket;
      default:
        return Icons.sports;
    }
  }

  @override
  Widget build(BuildContext context) {
    final FieldController controller = Get.find<FieldController>();
    final theme = Theme.of(context);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (controller.currentStoreId != store.id ||
          controller.currentSportId != sportCategory) {
        controller.loadData(store.id, sportCategory);
      }
    });

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF1976D2), Color(0xFF2196F3), Color(0xFF00C17C)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Đặt sân $sportCategory",
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Text(
              "${store.name} - ${store.address}",
              style: const TextStyle(fontSize: 12, color: Colors.white70),
            ),
          ],
        ),
      ),

      body: Column(
        children: [
          _buildDateSelector(controller),
          _buildLegend(),
          const SizedBox(height: 10),
          _buildSectionHeader("Lịch đặt sân"),

          Expanded(
            child: Obx(() {
              if (controller.isLoading.value) {
                return const Center(child: CircularProgressIndicator());
              }

              if (controller.fields.isEmpty) {
                return const Center(child: Text("Không tìm thấy sân nào"));
              }

              return ListView.builder(
                padding: const EdgeInsets.only(bottom: 100),
                itemCount: controller.fields.length,
                itemBuilder: (context, index) {
                  return _buildFieldRow(controller.fields[index], controller);
                },
              );
            }),
          ),
        ],
      ),

      bottomNavigationBar: _buildBottomSummary(controller, theme),
    );
  }

  // ----------------- DATE SELECTOR -----------------
  Widget _buildDateSelector(FieldController controller) {
    return Container(
      padding: const EdgeInsets.all(12),
      color: Colors.white,
      child: Row(
        children: [
          const Icon(Icons.access_time, color: Colors.grey),
          const SizedBox(width: 8),
          const Text("Chọn ngày:", style: TextStyle(color: Colors.grey)),
          const SizedBox(width: 10),

          InkWell(
            onTap: () async {
              final picked = await showDatePicker(
                context: Get.context!,
                initialDate: controller.selectedDate.value,
                firstDate: DateTime.now(),
                lastDate: DateTime.now().add(const Duration(days: 30)),
              );
              if (picked != null) controller.selectedDate.value = picked;
            },
            child: Obx(
              () => Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade300),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  DateFormat(
                    'dd/MM/yyyy',
                  ).format(controller.selectedDate.value),
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ),

          const Spacer(),
          Obx(
            () => Text(
              DateFormat('EEEE', 'vi').format(controller.selectedDate.value),
              style: const TextStyle(color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }

  // ----------------- LEGEND -----------------
  Widget _buildLegend() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      color: Colors.white,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _legendItem(
            const Color(0xFFE0F2F1),
            "Còn trống",
            Icons.add,
            Colors.teal,
          ),
          const SizedBox(width: 12),
          _legendItem(
            const Color(0xFFE53935),
            "Đã đặt",
            Icons.close,
            Colors.white,
          ),
          const SizedBox(width: 12),
          _legendItem(
            const Color(0xFF0085FF),
            "Đang chọn",
            Icons.check,
            Colors.white,
          ),
          const SizedBox(width: 12),
          _legendItem(
            Colors.white,
            "Giá ưu đãi",
            Icons.star,
            Colors.amber,
            hasBorder: true,
          ),
        ],
      ),
    );
  }

  Widget _legendItem(
    Color bg,
    String text,
    IconData icon,
    Color iconColor, {
    bool hasBorder = false,
  }) {
    return Row(
      children: [
        Container(
          width: 20,
          height: 20,
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(4),
            border: hasBorder
                ? Border.all(color: Colors.amber, width: 1.5)
                : null,
          ),
          child: Icon(icon, size: 14, color: iconColor),
        ),
        const SizedBox(width: 6),
        Text(text, style: const TextStyle(fontSize: 12)),
      ],
    );
  }

  Widget _buildSectionHeader(String title) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      width: double.infinity,
      color: const Color(0xFF009688),
      child: Text(
        title,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  // ----------------- FIELD ROW -----------------
  Widget _buildFieldRow(FieldModel field, FieldController controller) {
    final slots = controller.generateTimeSlots();
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      color: Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ---- NAME + ICON SPORT ----
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: const Color(0xFF00C17C),
                  radius: 18,
                  child: Icon(
                    getIconById(field.sportId),
                    size: 18,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(width: 12),

                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        field.name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const Row(
                        children: [
                          Icon(Icons.star, size: 14, color: Colors.amber),
                          Text(" 4.5", style: TextStyle(fontSize: 12)),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // ---- TIME SLOTS ----
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            child: Row(
              children: slots
                  // Truyền field.name để lưu vào SelectedSlot
                  .map(
                    (time) =>
                        _buildTimeSlot(controller, field.id, time, field.name),
                  )
                  .toList(),
            ),
          ),

          const SizedBox(height: 10),
        ],
      ),
    );
  }

  Widget _buildTimeSlot(
    FieldController controller,
    String fieldId,
    String time,
    String fieldName, // THÊM fieldName
  ) {
    return Obx(() {
      bool isSpecial = controller.isSpecialPrice(fieldId, time);
      // Cập nhật logic kiểm tra
      bool isSelected = controller.isSlotSelected(fieldId, time);
      bool isBooked = controller.isSlotBooked(fieldId, time);
      Color bgColor = const Color(0xFFE0F2F1);
      IconData icon = Icons.add;
      Color iconColor = Colors.teal;

      if (isBooked) {
        bgColor = const Color(0xFFE53935);
        icon = Icons.close;
        iconColor = Colors.white;
      } else if (isSelected) {
        bgColor = const Color(0xFF0085FF);
        icon = Icons.check;
        iconColor = Colors.white;
      } else if (isSpecial) {
        icon = Icons.star;
        iconColor = Colors.amber;
      }

      BoxBorder? border;
      if (!isBooked && !isSelected && isSpecial) {
        border = Border.all(color: Colors.amber, width: 1.5);
      } else if (!isBooked && !isSelected) {
        border = Border.all(color: Colors.teal.shade100);
      }

      return GestureDetector(
        onTap: () =>
            !isBooked ? controller.toggleSlot(fieldId, time, fieldName) : null,
        child: Container(
          margin: const EdgeInsets.only(right: 8),
          child: Column(
            children: [
              Text(
                time,
                style: const TextStyle(fontSize: 11, color: Colors.grey),
              ),
              const SizedBox(height: 4),
              Container(
                width: 45,
                height: 40,
                decoration: BoxDecoration(
                  color: bgColor,
                  borderRadius: BorderRadius.circular(8),
                  border: border,
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
            ],
          ),
        ),
      );
    });
  }

  // ----------------- BOTTOM SUMMARY -----------------
  Widget _buildBottomSummary(FieldController controller, ThemeData theme) {
    return Container(
      color: Colors.white,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Obx(
            () => controller.selectedSlotKeys.isNotEmpty
                ? Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    color: const Color(0xFF009688),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 10,
                          backgroundColor: Colors.white,
                          child: Text(
                            "${controller.selectedSlotKeys.length}",
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF009688),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        GestureDetector(
                          onTap: () => showCartBottomSheet(Get.context!),
                          child: const Text(
                            "Khung giờ đã chọn",
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  )
                : const SizedBox.shrink(),
          ),

          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, -2),
                ),
              ],
              color: Colors.white,
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      "Tổng thanh toán",
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Obx(
                      () => Text(
                        controller.formatCurrency(controller.totalPrice),
                        style: const TextStyle(
                          color: Color(0xFF00C17C),
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => controller.clearAllSlots(),
                        icon: const Icon(Icons.delete_outline),
                        label: const Text("Xóa tất cả"),
                      ),
                    ),
                    const SizedBox(width: 12),

                    Expanded(
                      flex: 2,
                      child: ElevatedButton(
                        onPressed: () async {
                          if (controller.selectedSlotKeys.isEmpty) {
                            Get.snackbar(
                              "Thông báo",
                              "Vui lòng chọn khung giờ",
                            );
                            return;
                          }

                          final result = await controller.createPaymentOrder();

                          if (result == 'success') {
                            Get.snackbar(
                              "Thành công",
                              "Đặt sân thành công! Giỏ hàng đã được làm mới.",
                              backgroundColor: Colors.green,
                              colorText: Colors.white,
                              duration: const Duration(seconds: 3),
                            );

                            controller.clearAllSlots(); // xóa giỏ

                            // Reload lại lịch để hiển thị slot vừa đặt là "Đã đặt"
                            if (controller.currentStoreId != null &&
                                controller.currentSportId != null) {
                              await controller.loadData(
                                controller.currentStoreId!,
                                controller.currentSportId!,
                              );
                            }
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0085FF),
                        ),
                        child: const Text(
                          "Thanh toán ngay",
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
