import 'dart:developer';

import 'package:flutter/cupertino.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import 'package:mobile/screens/store_screen.dart';
import 'package:mobile/screens/booking_screen.dart';
import 'package:mobile/screens/profile_screen.dart';
import 'package:mobile/screens/team_match_screen.dart';
import 'package:mobile/utilities/location_helper.dart';
import 'package:mobile/utilities/token_storage.dart';

class HomeController extends GetxController {
  var selectedIndex = 0.obs;
  final LocationHelper _locationHelper = LocationHelper();
  final FlutterSecureStorage secureStorage = FlutterSecureStorage();
  late final TokenStorage tokenStorage;

  final List<Widget> pages = [
    const StorePage(),
    const BookingsPage(),
    const TeamMatchPage(),
    const ProfilePage(),
  ];

  @override
  void onInit() {
    super.onInit();
    tokenStorage = TokenStorage(storage: secureStorage);
    getUserLocation();
  }

  Future<void> getUserLocation() async {
    await _locationHelper.getUserLocation();
    final String? accessToken = await tokenStorage.getAccessToken();
    log("Access Token in HomeScreen: $accessToken");
  }

  void onItemTapped(int index) {
    selectedIndex.value = index;
  }
}
