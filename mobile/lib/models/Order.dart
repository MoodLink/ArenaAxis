

import 'package:mobile/models/OrderDetail.dart';

class Order {
  final String id;
  final String userId;
  final String storeId;
  final String statusPayment;
  final int cost;
  final String orderCode;
  final bool isRated;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<OrderDetail> orderDetails;
  
  // Thông tin store (sẽ được load sau)
  String? storeName;
  String? storeAddress;
  String? storeImage;

  Order({
    required this.id,
    required this.userId,
    required this.storeId,
    required this.statusPayment,
    required this.cost,
    required this.orderCode,
    required this.isRated,
    required this.createdAt,
    required this.updatedAt,
    required this.orderDetails,
    this.storeName,
    this.storeAddress,
    this.storeImage,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['_id'],
      userId: json['userId'],
      storeId: json['storeId'],
      statusPayment: json['statusPayment'],
      cost: json['cost'],
      orderCode: json['orderCode'],
      isRated: json['isRated'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      orderDetails: (json['orderDetails'] as List)
          .map((detail) => OrderDetail.fromJson(detail))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'userId': userId,
      'storeId': storeId,
      'statusPayment': statusPayment,
      'cost': cost,
      'orderCode': orderCode,
      'isRated': isRated,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'orderDetails': orderDetails.map((d) => {
        'fieldId': d.fieldId,
        'startTime': d.startTime,
        'endTime': d.endTime,
        'price': d.price,
      }).toList(),
    };
  }

  // Helper methods
  DateTime get earliestStartTime {
    return orderDetails
        .map((d) => d.startDateTime)
        .reduce((a, b) => a.isBefore(b) ? a : b);
  }

  DateTime get latestEndTime {
    return orderDetails
        .map((d) => d.endDateTime)
        .reduce((a, b) => a.isAfter(b) ? a : b);
  }

  bool get isPaid => statusPayment == 'PAID';
  
  bool get isUpcoming {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final startDate = DateTime(
      earliestStartTime.year,
      earliestStartTime.month,
      earliestStartTime.day,
    );
    return startDate.isAtSameMomentAs(today) || startDate.isAfter(today);
  }
}