
class Province {
  final String id;
  final String name;
  final String nameEn;

  Province({
    required this.id,
    required this.name,
    required this.nameEn,
  });

  factory Province.fromJson(Map<String, dynamic> json) {
    return Province(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      nameEn: json['nameEn'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'nameEn': nameEn,
    };
  }
}
class Ward {
  final String id;
  final String name;
  final String nameEn;

  Ward({
    required this.id,
    required this.name,
    required this.nameEn,
  });

  factory Ward.fromJson(Map<String, dynamic> json) {
    return Ward(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      nameEn: json['nameEn'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'nameEn': nameEn,
    };
  }
}