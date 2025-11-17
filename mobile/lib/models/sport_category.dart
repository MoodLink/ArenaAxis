import 'package:flutter/material.dart';

class SportCategory {
  final String id;
  final String name;
  final IconData icon;
  final Color color;

  SportCategory({
    required this.id,
    required this.name,
    required this.icon,
    required this.color,
  });

  // Từ JSON (nếu load từ API)
  factory SportCategory.fromJson(Map<String, dynamic> json) {
    return SportCategory(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      icon: _getIconFromString(json['icon']),
      color: Color(int.parse(json['color'].replaceFirst('#', '0xFF'))),
    );
  }

  // Sang JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'icon': icon.codePoint.toString(),
      'color': '#${color.value.toRadixString(16).substring(2)}',
    };
  }

  static IconData _getIconFromString(String? iconName) {
    switch (iconName) {
      case 'sports_soccer':
        return Icons.sports_soccer;
      case 'sports_basketball':
        return Icons.sports_basketball;
      case 'sports_tennis':
        return Icons.sports_tennis;
      case 'pool':
        return Icons.pool;
      case 'sports_tennis_rounded':
        return Icons.sports_tennis_rounded;
      default:
        return Icons.sports;
    }
  }
}