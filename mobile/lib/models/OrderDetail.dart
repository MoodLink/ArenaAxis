class OrderDetail {
  final int id;
  final int orderId;
  final int fieldId;
  final DateTime startTime;
  final DateTime endTime;
  final double price;

  OrderDetail({
    required this.id,
    required this.orderId,
    required this.fieldId,
    required this.startTime,
    required this.endTime,
    required this.price,
  });

  factory OrderDetail.fromJson(Map<String, dynamic> json) {
    return OrderDetail(
      id: json['order_detail_id'],
      orderId: json['order_id'],
      fieldId: json['field_id'],
      startTime: DateTime.parse(json['start_time']),
      endTime: DateTime.parse(json['end_time']),
      price: double.parse(json['price'].toString()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'order_detail_id': id,
      'order_id': orderId,
      'field_id': fieldId,
      'start_time': startTime.toIso8601String(),
      'end_time': endTime.toIso8601String(),
      'price': price,
    };
  }
}
