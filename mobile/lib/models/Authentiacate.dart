import 'package:mobile/models/user.dart';

class AuthResponse {
  final String accessToken;
  final String refreshToken;
  final User user;

  AuthResponse({
    required this.accessToken,
    required this.refreshToken, 
    required this.user,
  });
  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      accessToken: json['token'],
      refreshToken: json['token'],
      user: User.fromJson(json['user']),
    );
  }
}