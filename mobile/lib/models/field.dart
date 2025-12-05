import 'package:mobile/models/FieldPrincing.dart';
import 'package:mobile/models/cart_item.dart';

class FieldModel {
  final String id;
  final String name;
  final String sportId;
  final String storeId;
  final double defaultPrice;
  final String status;
  final List<BookedSlot> bookedSlots;
  final List<PricingDetail> pricings;

  FieldModel({
    required this.id,
    required this.name,
    required this.sportId,
    required this.storeId,
    required this.defaultPrice,
    required this.status,
    required this.bookedSlots,
    required this.pricings,
  });

  factory FieldModel.fromJson(Map<String, dynamic> json) {
    List<BookedSlot> bookings = [];
    if (json['statusField'] != null && json['statusField'] is List) {
      bookings = (json['statusField'] as List)
          .map((e) => BookedSlot.fromJson(e))
          .toList();
    }

    List<PricingDetail> prices = [];
    if (json['pricings'] != null && json['pricings'] is List) {
      prices = (json['pricings'] as List)
          .map((e) => PricingDetail .fromJson(e))
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
      pricings: prices,
    );
  }
}