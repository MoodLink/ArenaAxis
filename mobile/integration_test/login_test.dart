// integration_test/login_validation_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/field_search_controller.dart';
import 'package:mobile/controller/home_controller.dart';
import 'package:mobile/controller/store_controller.dart';
import 'package:mobile/controller/sport_category_controller.dart';
import 'package:mobile/screens/login_screen.dart';
import 'package:mobile/screens/home_screen.dart';
import 'package:mobile/services/location_service.dart';

void main() {
  Future<void> fillLoginForm(
    WidgetTester tester, {
    required String email,
    required String password,
  }) async {
    await tester.enterText(find.byKey(const Key('emailField')), email);
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(seconds: 1));

    await tester.enterText(find.byKey(const Key('passwordField')), password);
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(seconds: 1));
  }


  testWidgets('1. Đăng nhập thành công - Thông tin hợp lệ', (tester) async {
    await tester.pumpWidget(
      GetMaterialApp(
        home: const LoginScreen(),
        getPages: [GetPage(name: '/home', page: () => HomeScreen())],
      ),
    );
    Get.put(LocationService());
    Get.put(StoreController());
    Get.put(FieldSearchController());
    Get.put(HomeController());
    Get.put(SportCategoryController());
    await fillLoginForm(tester, email: 'tri@gmail.com', password: 'Tri1234567');

    final loginButton = find.text('Đăng nhập');
    await tester.ensureVisible(loginButton);
    await tester.tap(loginButton);
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(seconds: 3));
    expect(
      find.text("Tìm sân để chơi thôi", findRichText: true),
      findsOneWidget,
    );
  });

  testWidgets('2. Email trống', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: LoginScreen()));

    await fillLoginForm(tester, email: '', password: '12345678');

    final loginButton = find.text('Đăng nhập');
    await tester.ensureVisible(loginButton);
    await tester.tap(loginButton);
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(seconds: 2));
    expect(find.text("Vui lòng nhập email"), findsOneWidget);
    expect(
      find.text("Let’s Connect With Us!", findRichText: true),
      findsOneWidget,
    );
  });

  testWidgets('3. Email sai định dạng (thiếu @)', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: LoginScreen()));

    await fillLoginForm(tester, email: 'testgmail.com', password: '12345678');

    final loginButton = find.text('Đăng nhập');
    await tester.ensureVisible(loginButton);
    await tester.tap(loginButton);
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(seconds: 2));
    expect(find.text("Email không hợp lệ"), findsOneWidget);
    expect(
      find.text("Let’s Connect With Us!", findRichText: true),
      findsOneWidget,
    );
  });

  testWidgets('4. Email thiếu domain (.com)', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: LoginScreen()));

    await fillLoginForm(tester, email: 'test@gmail', password: '12345678');

    final loginButton = find.text('Đăng nhập');
    await tester.ensureVisible(loginButton);
    await tester.tap(loginButton);
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(seconds: 2));
    expect(find.text("Email không hợp lệ"), findsOneWidget);
    expect(
      find.text("Let’s Connect With Us!", findRichText: true),
      findsOneWidget,
    );
  });

  testWidgets('5. Mật khẩu trống', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: LoginScreen()));

    await fillLoginForm(tester, email: 'tri@gmail.com', password: '');

    final loginButton = find.text('Đăng nhập');
    await tester.ensureVisible(loginButton);
    await tester.tap(loginButton);
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(seconds: 2));
    expect(find.text("Password không được để trống"), findsOneWidget);
    expect(
      find.text("Let’s Connect With Us!", findRichText: true),
      findsOneWidget,
    );
  });

  testWidgets('6. Mật khẩu dưới 6 ký tự', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: LoginScreen()));

    await fillLoginForm(tester, email: 'tri@gmail.com', password: '123');

    final loginButton = find.text('Đăng nhập');
    await tester.ensureVisible(loginButton);
    await tester.tap(loginButton);
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(seconds: 2));
    expect(find.text("Password phải có ít nhất 6 ký tự"), findsOneWidget);
    expect(
      find.text("Let’s Connect With Us!", findRichText: true),
      findsOneWidget,
    );
  });
  testWidgets('6. Mật khẩu không có chữ viết hoa', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: LoginScreen()));

    await fillLoginForm(
      tester,
      email: 'tri@gmail.com',
      password: 'hellojohn123',
    );

    final loginButton = find.text('Đăng nhập');
    await tester.ensureVisible(loginButton);
    await tester.tap(loginButton);
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(seconds: 2));
    expect(find.text("Password phải chứa ít nhất 1 chữ hoa"), findsOneWidget);
    expect(
      find.text("Let’s Connect With Us!", findRichText: true),
      findsOneWidget,
    );
  });
  testWidgets('7. Cả email và mật khẩu đều trống', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: LoginScreen()));

    final loginButton = find.text('Đăng nhập');
    await tester.ensureVisible(loginButton);
    await tester.tap(loginButton);
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(seconds: 2));
    expect(find.text("Password không được để trống"), findsOneWidget);
    expect(find.text("Vui lòng nhập email"), findsOneWidget);
    expect(
      find.text("Let’s Connect With Us!", findRichText: true),
      findsOneWidget,
    );
  });
}
