class Order {
  final int id;
  final int userId;
  final int storeId;
  final double cost;
  final String statusPayment;
  final DateTime createdAt;

  Order({
    required this.id,
    required this.userId,
    required this.storeId,
    required this.cost,
    required this.statusPayment,
    required this.createdAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['order_id'],
      userId: json['user_id'],
      storeId: json['store_id'],
      cost: double.parse(json['cost'].toString()),
      statusPayment: json['status_payment'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'order_id': id,
      'user_id': userId,
      'store_id': storeId,
      'cost': cost,
      'status_payment': statusPayment,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
