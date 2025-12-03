// Thêm model mới để lưu trữ thông tin slot đã chọn
class SelectedSlot {
  final String fieldId;
  final String date; // Format: yyyy-MM-dd
  final String startTime;
  final String key; // Dùng làm ID duy nhất: date_fieldId_startTime
  final String fieldName;

  SelectedSlot({
    required this.fieldId,
    required this.date,
    required this.startTime,
    required this.fieldName,
  }) : key = "${date}_${fieldId}_$startTime";

  // Thêm một factory constructor để tạo từ key (ví dụ: "2025-11-30_f1_13:00")
  factory SelectedSlot.fromKey(String key, String fieldName) {
    final parts = key.split('_');
    return SelectedSlot(
      date: parts[0],
      fieldId: parts[1],
      startTime: parts[2],
      fieldName: fieldName,
    );
  }
}