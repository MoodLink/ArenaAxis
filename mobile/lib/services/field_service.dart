import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:mobile/models/FieldPrincing.dart';
import 'package:mobile/models/field.dart';

class FieldService {
  static const String baseUrl = "https://arena-axis.vercel.app";

  // 1. Lấy danh sách sân (KÈM NGÀY)
  Future<List<FieldModel>> getFields(String storeId, String sportId, DateTime date) async {
    // Format ngày thành yyyy-MM-dd
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

  // 2. Lấy cấu hình giá (Giữ nguyên logic của bạn)
  Future<FieldPricingResponse?> getFieldPricing(String fieldPricingId) async {
    final String url = "$baseUrl/api/v1/field-pricings/$fieldPricingId";
    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        log("Field Pricing Data: $body");
        return FieldPricingResponse.fromJson(body);
      }
    } catch (e) {
      log("Exception pricing: $e");
    }
    return null;
  }
}