import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/field_search_controller.dart';
import 'package:mobile/controller/store_controller.dart';
import 'package:mobile/providers/sport_category_controller.dart';
import 'package:mobile/screens/home_screen.dart';
import 'package:mobile/screens/login_screen.dart';
import 'package:mobile/controller/home_controller.dart';
import 'package:mobile/services/location_service.dart';

void main() {
  group('LoginScreen - Basic Login Test', () {
    setUp(() {
      // Inject đúng thứ tự
      Get.put(LocationService());
      Get.put(FieldSearchController());
      Get.put(StoreController());
      Get.put(HomeController());
      Get.put(SportCategoryController());
    });

    tearDown(() {
      Get.deleteAll();
    });

    testWidgets('Nhập username password và bấm nút login', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        GetMaterialApp(
          home: const LoginScreen(),
          getPages: [GetPage(name: "/home", page: () => HomeScreen())],
        ),
      );

      await tester.enterText(
        find.byKey(const Key('emailField')),
        'tr3i@gmail.com',
      );
      await tester.enterText(
        find.byKey(const Key('passwordField')),
        'Tri1234567',
      );

      await tester.tap(find.byKey(const Key('loginButton')));
      await tester.pump(const Duration(seconds: 3));
      await tester.pumpAndSettle();

      // Kiểm tra StorePage có text "Chào bạn"
      expect(find.text("Chào bạn! 👋", findRichText: true), findsOneWidget);
    });
  });
}
