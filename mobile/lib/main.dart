import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:mobile/binding/app_binding.dart';

import 'package:mobile/screens/home_screen.dart';
import 'package:mobile/utilities/token_storage.dart';
import 'screens/onboarding_screen.dart';
import 'package:google_fonts/google_fonts.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('vi_VN');
  final FlutterSecureStorage secureStorage = FlutterSecureStorage();
  final TokenStorage tokenStorage = TokenStorage(storage: secureStorage);
  final String? accessToken = await tokenStorage.getAccessToken();
  final String? firstOpen = await tokenStorage.getFirstOpen();
  GoogleFonts.config.allowRuntimeFetching = true;
  log("first open: $firstOpen");
  runApp(
    MyApp(isLoggedIn: accessToken != null, isFirstOpen: firstOpen == 'true'),
  );
}

class MyApp extends StatelessWidget {
  final bool isLoggedIn;
  final bool isFirstOpen;

  MyApp({Key? key, required this.isLoggedIn, required this.isFirstOpen})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'SportMatch',
      // register bindings so SportCategoryController is available app-wide
      initialBinding: AppBinding(),
      theme: ThemeData.light().copyWith(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        inputDecorationTheme: const InputDecorationTheme(
          border: OutlineInputBorder(),
        ),
      ),
      darkTheme: ThemeData.dark().copyWith(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blue,
          brightness: Brightness.dark,
        ),
        inputDecorationTheme: const InputDecorationTheme(
          border: OutlineInputBorder(),
        ),
      ),
      debugShowCheckedModeBanner: false,
      // Điều hướng dựa trên trạng thái đăng nhập
      home: isFirstOpen ? HomeScreen() : OnboardingScreen(),
    );
  }
}
  