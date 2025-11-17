
import 'package:mobile/models/booking.dart';

class Payment {
  final String id;
  final String bookingId;
  final double amount;
  final PaymentStatus status;
  final String paymentMethod;
  final String? transactionId;
  final DateTime createdAt;
  final DateTime? completedAt;

  Payment({
    required this.id,
    required this.bookingId,
    required this.amount,
    required this.status,
    required this.paymentMethod,
    this.transactionId,
    required this.createdAt,
    this.completedAt,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['id'],
      bookingId: json['bookingId'],
      amount: json['amount'].toDouble(),
      status: PaymentStatus.values.firstWhere(
        (e) => e.toString() == 'PaymentStatus.${json['status']}',
      ),
      paymentMethod: json['paymentMethod'],
      transactionId: json['transactionId'],
      createdAt: DateTime.parse(json['createdAt']),
      completedAt: json['completedAt'] != null 
          ? DateTime.parse(json['completedAt'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'bookingId': bookingId,
      'amount': amount,
      'status': status.toString().split('.').last,
      'paymentMethod': paymentMethod,
      'transactionId': transactionId,
      'createdAt': createdAt.toIso8601String(),
      'completedAt': completedAt?.toIso8601String(),
    };
  }
}