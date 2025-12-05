import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:mobile/models/field.dart';
class FieldService {
  static const String baseUrl = "https://arena-axis.vercel.app";

  Future<List<FieldModel>> getFields(String storeId, String sportId, DateTime date) async {
    String formattedDate = DateFormat('yyyy-MM-dd').format(date);
    
    String url;
    if (sportId == "tất cả") {
      url = "$baseUrl/api/v1/fields/?store_id=$storeId&date_time=$formattedDate";
    } else {
      url = "$baseUrl/api/v1/fields/?sport_id=$sportId&store_id=$storeId&date_time=$formattedDate";
    }

    try {
      log("GET Fields: $url");
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        if (body['data'] is List) {
          return (body['data'] as List)
              .map((e) => FieldModel.fromJson(e))
              .toList();
        }
      } else {
        log("Error fields: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      log("Exception fields: $e");
    }
    return [];
  }
}