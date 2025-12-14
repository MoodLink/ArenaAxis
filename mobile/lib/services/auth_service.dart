import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;
import 'package:mobile/models/Authentiacate.dart';
import '../models/user.dart';

class AuthService {
  final String baseUrl;

  AuthService({this.baseUrl = 'http://www.executexan.store'});

  // ---------------------- LOGIN ----------------------
  Future<AuthResponse?> login(String email, String password) async {
    final url = Uri.parse('$baseUrl/auth/user');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return AuthResponse.fromJson(data);
    } else {
      final url = Uri.parse('$baseUrl/auth/client');
      final ClientResponse = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );
      final data = jsonDecode(ClientResponse.body);
      return AuthResponse.fromJson(data);
    }
  }

  // ---------------------- REGISTER ----------------------
  Future<User?> register({
    required String email,
    required String password,
    required String fullName,
    required String phone,
  }) async {
    final url = Uri.parse('$baseUrl/users');
    log('Attempting to register user with email: $email, fullName: $fullName, phone: $phone');
    log('Request URL: $url');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
        'name': fullName,
        'phone': phone,
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return User.fromJson(data);
    } else {
      print('Register failed: ${response.body}');
      return null;
    }
  }

  // ---------------------- LOGOUT ----------------------
  Future<bool> logout(String token) async {
    final url = Uri.parse('$baseUrl/auth/logout');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return true;
    } else {
      print('Logout failed: ${response.body}');
      return false;
    }
  }

  // ---------------------- GET CURRENT USER ----------------------
  Future<User?> getCurrentUser(String token) async {
    try {
      final url = Uri.parse('$baseUrl/users/myself');
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        log('Get current user success: $data');
        return User.fromJson(data);
      } else {
        log('Get current user failed: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      log('Error getting current user: $e');
      return null;
    }
  }
}