class FieldPricing {
  final int id;
  final int fieldId;
  final int dayOfWeek; // 0-6
  final String startAt;
  final String endAt;
  final double price;

  FieldPricing({
    required this.id,
    required this.fieldId,
    required this.dayOfWeek,
    required this.startAt,
    required this.endAt,
    required this.price,
  });

  factory FieldPricing.fromJson(Map<String, dynamic> json) {
    return FieldPricing(
      id: json['field_pricing_id'],
      fieldId: json['field_id'],
      dayOfWeek: json['day_of_week'],
      startAt: json['start_at'],
      endAt: json['end_at'],
      price: double.parse(json['price'].toString()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'field_pricing_id': id,
      'field_id': fieldId,
      'day_of_week': dayOfWeek,
      'start_at': startAt,
      'end_at': endAt,
      'price': price,
    };
  }
}
