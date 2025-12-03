// Model cho Slot đã bị đặt (nằm trong statusField của API)
class BookedSlot {
  final String startTime;
  final String endTime;

  BookedSlot({required this.startTime, required this.endTime});

  factory BookedSlot.fromJson(Map<String, dynamic> json) {
    // Giả sử API trả về start_time/end_time hoặc startAt/endAt
    // Bạn hãy điều chỉnh key này theo đúng API thực tế trả về trong statusField
    return BookedSlot(
      startTime: json['start_time'] ?? json['startAt'] ?? '', 
      endTime: json['end_time'] ?? json['endAt'] ?? '',
    );
  }
}

class FieldModel {
  final String id;
  final String name;
  final String sportId;
  final String storeId;
  final double defaultPrice;
  final String status;
  final List<BookedSlot> bookedSlots; // Quan trọng: Danh sách giờ đã có người đặt

  FieldModel({
    required this.id,
    required this.name,
    required this.sportId,
    required this.storeId,
    required this.defaultPrice,
    required this.status,
    required this.bookedSlots,
  });

  factory FieldModel.fromJson(Map<String, dynamic> json) {
    // Parse statusField thành List<BookedSlot>
    List<BookedSlot> bookings = [];
    if (json['statusField'] != null && json['statusField'] is List) {
      bookings = (json['statusField'] as List)
          .map((e) => BookedSlot.fromJson(e))
          .toList();
    }

    return FieldModel(
      id: json['_id'] ?? '',
      name: json['name'] ?? 'Sân chưa đặt tên',
      sportId: json['sportId'] ?? '',
      storeId: json['storeId'] ?? '',
      defaultPrice: double.tryParse(json['defaultPrice'].toString()) ?? 0.0,
      status: json['activeStatus'] == true ? 'active' : 'inactive',
      bookedSlots: bookings,
    );
  }
}