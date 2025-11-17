import 'package:mobile/models/payment.dart';

enum BookingStatus {
  pending,
  confirmed,
  cancelled,
  completed
}

enum PaymentStatus {
  pending,
  completed,
  failed,
  refunded
}

class Booking {
  final String id;
  final String userId;
  final String fieldId;
  final DateTime startTime;
  final DateTime endTime;
  final double totalAmount;
  final BookingStatus status;
  final Payment? payment;
  final DateTime createdAt;

  Booking({
    required this.id,
    required this.userId,
    required this.fieldId,
    required this.startTime,
    required this.endTime,
    required this.totalAmount,
    required this.status,
    this.payment,
    required this.createdAt,
  });

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'],
      userId: json['userId'],
      fieldId: json['fieldId'],
      startTime: DateTime.parse(json['startTime']),
      endTime: DateTime.parse(json['endTime']),
      totalAmount: json['totalAmount'].toDouble(),
      status: BookingStatus.values.firstWhere(
        (e) => e.toString() == 'BookingStatus.${json['status']}',
      ),
      payment: json['payment'] != null ? Payment.fromJson(json['payment']) : null,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'fieldId': fieldId,
      'startTime': startTime.toIso8601String(),
      'endTime': endTime.toIso8601String(),
      'totalAmount': totalAmount,
      'status': status.toString().split('.').last,
      'payment': payment?.toJson(),
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
