class OrderDetail {
  final String fieldId;
  final String startTime;
  final String endTime;
  final int price;

  OrderDetail({
    required this.fieldId,
    required this.startTime,
    required this.endTime,
    required this.price,
  });

  factory OrderDetail.fromJson(Map<String, dynamic> json) {
    return OrderDetail(
      fieldId: json['fieldId'],
      startTime: json['startTime'],
      endTime: json['endTime'],
      price: json['price'],
    );
  }

  DateTime get startDateTime => DateTime.parse(startTime.replaceAll(' ', 'T'));
  DateTime get endDateTime => DateTime.parse(endTime.replaceAll(' ', 'T'));
}