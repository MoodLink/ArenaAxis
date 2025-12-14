import 'dart:developer';

import 'package:flutter/cupertino.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import 'package:mobile/screens/store_screen.dart';
import 'package:mobile/screens/order_history_screen.dart';
import 'package:mobile/screens/profile_screen.dart';
import 'package:mobile/screens/team_match_screen.dart';
import 'package:mobile/utilities/location_helper.dart';
import 'package:mobile/utilities/token_storage.dart';

class HomeController extends GetxController {
  var selectedIndex = 0.obs;
  var locationName = ''.obs;
  final LocationHelper _locationHelper = LocationHelper();

  @override
  void onInit() {
    super.onInit();
    getUserLocation();
  }

  Future<void> getUserLocation() async {
    final data = await _locationHelper.getUserLocation();
    if (data != null) {
      final ward = data["ward"] ?? "";
      final province = data["province"] ?? "";
      locationName.value = "$ward, $province";
    }
  }

  final FlutterSecureStorage secureStorage = FlutterSecureStorage();
  late final TokenStorage tokenStorage;

  final List<Widget> pages = [
    const StorePage(),
    const OrderHistoryPage(),
    const TeamMatchPage(),
    const ProfilePage(),
  ];



  void onItemTapped(int index) {
    selectedIndex.value = index;
  }
}
