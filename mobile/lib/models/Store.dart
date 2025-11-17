
import 'package:mobile/models/location.dart';

class Store {
  final String id;
  final String name;
  final String? avatarUrl;
  final String? coverUrl;
  final String startTime;
  final String endTime;
  final double averageRating;
  final int orderCount;
  final int viewCount;
  final String  address;
  final Ward ward;
  final Province province;

  Store({
    required this.id,
    required this.name,
    this.avatarUrl,
    this.coverUrl,
    required this.startTime,
    required this.endTime,
    required this.averageRating,
    required this.orderCount,
    required this.viewCount,
    required this.address,
    required this.ward,
    required this.province,
  });

  factory Store.fromJson(Map<String, dynamic> json) {
    return Store(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      avatarUrl: json['avatarUrl'],
      coverUrl: json['coverUrl'],
      startTime: json['startTime'] ?? '',
      endTime: json['endTime'] ?? '',
      averageRating: (json['averageRating'] ?? 0).toDouble(),
      orderCount: json['orderCount'] ?? 0,
      viewCount: json['viewCount'] ?? 0,
      address: json['address'] ?? '',
      ward: Ward.fromJson(json['ward'] ?? {}),
      province: Province.fromJson(json['province'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'avatarUrl': avatarUrl,
      'coverUrl': coverUrl,
      'startTime': startTime,
      'endTime': endTime,
      'averageRating': averageRating,
      'orderCount': orderCount,
      'viewCount': viewCount,
      'address': address, 
      'ward': ward.toJson(),
      'province': province.toJson(),
    };
  }

  /// Getter cho địa chỉ đầy đủ
  String get fullAddress => '${ward.name}, ${province.name}';

  /// Getter cho hình ảnh (avatar hoặc cover)
  String? get imageUrl => avatarUrl ?? coverUrl;
}
