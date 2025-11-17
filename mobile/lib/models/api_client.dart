/// ✅ Lớp bao bọc response từ API
class ApiResponse<T> {
  final bool success;
  final String? message;
  final T? data;
  final int? statusCode;

  ApiResponse({
    required this.success,
    this.message,
    this.data,
    this.statusCode,
  });

  @override
  String toString() {
    return 'ApiResponse(success: $success, code: $statusCode, message: $message, data: $data)';
  }
}
