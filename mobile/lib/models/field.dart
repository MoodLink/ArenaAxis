import 'package:mobile/models/FieldPrincing.dart';

class Field {
  final String id;
  final String name;
  final String description;
  final String storeId;
  final String sportId;
  final String status;
  final List<String> images;
  final List<FieldPricing> prices;

  Field({
    required this.id,
    required this.name,
    required this.description,
    required this.storeId,
    required this.sportId,
    required this.status,
    required this.images,
    required this.prices,
  });

  factory Field.fromJson(Map<String, dynamic> json) {
    return Field(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      storeId: json['storeId'],
      sportId: json['sportId'], 
      status: json['status'],
      images: List<String>.from(json['images']),
      prices: (json['prices'] as List)
          .map((price) => FieldPricing.fromJson(price))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'storeId': storeId,
      'sportId': sportId,
      'status': status,
      'images': images,
      'prices': prices.map((price) => price.toJson()).toList(),
    };
  }
}

