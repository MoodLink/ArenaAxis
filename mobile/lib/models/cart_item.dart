class SelectedSlot {
  final String fieldId;
  final String date;
  final String startTime;
  final String fieldName;
  final double price;

  SelectedSlot({
    required this.fieldId,
    required this.date,
    required this.startTime,
    required this.fieldName,
    required this.price,
  });
}

class BookedSlot {
  final String startTime;
  final String endTime;
  final String statusPayment;

  BookedSlot({
    required this.startTime,
    required this.endTime,
    required this.statusPayment,
  });

  factory BookedSlot.fromJson(Map<String, dynamic> json) {
    return BookedSlot(
      startTime: json['startTime'] ?? '',
      endTime: json['endTime'] ?? '',
      statusPayment: json['statusPayment'] ?? '',
    );
  }
}
