import 'dart:convert';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/models/location.dart';

class LocationService extends GetxService {
  static const String baseUrl =
      'https://www.executexan.store'; // Replace with actual URL

  Future<List<Province>> fetchProvinces() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/provinces'));

      if (response.statusCode == 200) {
        final List<dynamic> jsonData = jsonDecode(response.body);
        return jsonData.map((json) => Province.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load provinces');
      }
    } catch (e) {
      print('Error fetching provinces: $e');
      rethrow;
    }
  }

  Future<List<Ward>> fetchWards(String provinceId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/provinces/$provinceId/wards'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> jsonData = jsonDecode(response.body);
        return jsonData.map((json) => Ward.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load wards');
      }
    } catch (e) {
      print('Error fetching wards: $e');
      rethrow;
    }
  }
}
