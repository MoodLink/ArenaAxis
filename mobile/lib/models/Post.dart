class Post {
  final int id;
  final int orderId;
  final String startAt;
  final String endAt;
  final int numberPeople;
  final String? description;
  final DateTime createdAt;

  Post({
    required this.id,
    required this.orderId,
    required this.startAt,
    required this.endAt,
    required this.numberPeople,
    this.description,
    required this.createdAt,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['post_id'],
      orderId: json['order_id'],
      startAt: json['start_at'],
      endAt: json['end_at'],
      numberPeople: json['number_people'],
      description: json['description'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'post_id': id,
      'order_id': orderId,
      'start_at': startAt,
      'end_at': endAt,
      'number_people': numberPeople,
      'description': description,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
