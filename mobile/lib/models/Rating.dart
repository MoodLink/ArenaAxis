class Rating {
  final int id;
  final int userId;
  final int storeId;
  final int star;
  final String? comment;

  Rating({
    required this.id,
    required this.userId,
    required this.storeId,
    required this.star,
    this.comment,
  });

  factory Rating.fromJson(Map<String, dynamic> json) {
    return Rating(
      id: json['rating_id'],
      userId: json['user_id'],
      storeId: json['store_id'],
      star: json['star'],
      comment: json['comment'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'rating_id': id,
      'user_id': userId,
      'store_id': storeId,
      'star': star,
      'comment': comment,
    };
  }
}
