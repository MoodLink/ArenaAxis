class ApplyPost {
  final int id;
  final int postId;
  final int userId;
  final String applyStatus;
  final DateTime createdAt;

  ApplyPost({
    required this.id,
    required this.postId,
    required this.userId,
    required this.applyStatus,
    required this.createdAt,
  });

  factory ApplyPost.fromJson(Map<String, dynamic> json) {
    return ApplyPost(
      id: json['apply_post_id'],
      postId: json['post_id'],
      userId: json['user_id'],
      applyStatus: json['apply_status'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'apply_post_id': id,
      'post_id': postId,
      'user_id': userId,
      'apply_status': applyStatus,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
