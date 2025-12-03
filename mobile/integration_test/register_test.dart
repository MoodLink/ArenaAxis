// integration_test/register_validation_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/field_search_controller.dart';
import 'package:mobile/controller/home_controller.dart';
import 'package:mobile/controller/store_controller.dart';
import 'package:mobile/controller/sport_category_controller.dart';

import 'package:mobile/screens/register_screen.dart';
import 'package:mobile/services/location_service.dart';

void main() {
  Future<void> fillRegisterForm(
    WidgetTester tester, {
    required String username,
    required String email,
    required String password,
    required String phone,
  }) async {
    await tester.enterText(find.byKey(const Key('usernameField')), username);
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(milliseconds: 400));

    await tester.enterText(find.byKey(const Key('emailField')), email);
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(milliseconds: 400));

    await tester.enterText(find.byKey(const Key('passwordField')), password);
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(milliseconds: 400));

    await tester.enterText(find.byKey(const Key('phoneField')), phone);
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(milliseconds: 500));
  }

  testWidgets('1. Đăng ký thành công - Dữ liệu hợp lệ', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: RegisterScreen()));
    Get.put(LocationService());
    Get.put(StoreController());
    Get.put(FieldSearchController());
    Get.put(HomeController());
    Get.put(SportCategoryController());
    await fillRegisterForm(
      tester,
      username: 'Nguyen Van A',
      email: 'nguyenvana@gmail.com',
      password: '12345678',
      phone: '0901234567',
    );
    final buttonFinder = find.text('Đăng ký');
    await tester.ensureVisible(buttonFinder);
    await tester.pumpAndSettle();

    await tester.tap(buttonFinder);
    await tester.pump();
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(seconds: 2));
    expect(
      find.text("Let’s Connect With Us!", findRichText: true),
      findsOneWidget,
    );
  });

  testWidgets('2. Username trống', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: RegisterScreen()));

    await fillRegisterForm(
      tester,
      username: '',
      email: 'test@gmail.com',
      password: '12345678',
      phone: '0901234567',
    );

    final buttonFinder = find.text('Đăng ký');
    await tester.ensureVisible(buttonFinder);
    await tester.pumpAndSettle();

    await tester.tap(buttonFinder);
    await tester.pump();
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(seconds: 2));
    expect(find.text("Tell me some", findRichText: true), findsOneWidget);
  });

  testWidgets('3. Username dưới 3 ký tự', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: RegisterScreen()));

    await fillRegisterForm(
      tester,
      username: 'Ab',
      email: 'test@gmail.com',
      password: '12345678',
      phone: '0901234567',
    );

    final buttonFinder = find.text('Đăng ký');
    await tester.ensureVisible(buttonFinder);
    await tester.pumpAndSettle();

    await tester.tap(buttonFinder);
    await tester.pump();
    await tester.pumpAndSettle();

    expect(find.text("Tell me some", findRichText: true), findsOneWidget);
  });

  testWidgets('4. Email sai định dạng (thiếu @)', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: RegisterScreen()));

    await fillRegisterForm(
      tester,
      username: 'Valid User',
      email: 'testgmail.com',
      password: '12345678',
      phone: '0901234567',
    );

    final buttonFinder = find.text('Đăng ký');
    await tester.ensureVisible(buttonFinder);
    await tester.pumpAndSettle();

    await tester.tap(buttonFinder);
    await tester.pump();
    await tester.pumpAndSettle();

    expect(find.text("Tell me some", findRichText: true), findsOneWidget);
  });

  testWidgets('5. Email thiếu domain (.com)', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: RegisterScreen()));

    await fillRegisterForm(
      tester,
      username: 'Valid User',
      email: 'test@gmail',
      password: '12345678',
      phone: '0901234567',
    );

    final buttonFinder = find.text('Đăng ký');
    await tester.ensureVisible(buttonFinder);
    await tester.pumpAndSettle();

    await tester.tap(buttonFinder);
    await tester.pump();
    await tester.pumpAndSettle();
    expect(find.text("Tell me some", findRichText: true), findsOneWidget);
  });

  testWidgets('6. Password dưới 6 ký tự', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: RegisterScreen()));

    await fillRegisterForm(
      tester,
      username: 'Valid User',
      email: 'test@gmail.com',
      password: '123',
      phone: '0901234567',
    );

    final buttonFinder = find.text('Đăng ký');
    await tester.ensureVisible(buttonFinder);
    await tester.pumpAndSettle();

    await tester.tap(buttonFinder);
    await tester.pump();
    await tester.pumpAndSettle();

    expect(find.text("Tell me some", findRichText: true), findsOneWidget);
  });

  testWidgets('7. Số điện thoại dưới 10 số', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: RegisterScreen()));

    await fillRegisterForm(
      tester,
      username: 'Valid User',
      email: 'test@gmail.com',
      password: '12345678',
      phone: '123456',
    );

    final buttonFinder = find.text('Đăng ký');
    await tester.ensureVisible(buttonFinder);
    await tester.pumpAndSettle();

    await tester.tap(buttonFinder);
    await tester.pump();
    await tester.pumpAndSettle();

    expect(find.text("Tell me some", findRichText: true), findsOneWidget);
  });

  testWidgets('8. Số điện thoại có chữ cái', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: RegisterScreen()));

    await fillRegisterForm(
      tester,
      username: 'Valid User',
      email: 'test@gmail.com',
      password: '12345678',
      phone: '090abc1234',
    );

    final buttonFinder = find.text('Đăng ký');
    await tester.ensureVisible(buttonFinder);
    await tester.pumpAndSettle();

    await tester.tap(buttonFinder);
    await tester.pump();
    await tester.pumpAndSettle();

    expect(find.text("Tell me some", findRichText: true), findsOneWidget);
  });

  testWidgets('9. Tất cả các trường trống', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: RegisterScreen()));

    final buttonFinder = find.text('Đăng ký');
    await tester.ensureVisible(buttonFinder);
    await tester.pumpAndSettle();

    await tester.tap(buttonFinder);
    await tester.pump();
    await tester.pumpAndSettle();

    expect(find.text("Tell me some", findRichText: true), findsOneWidget);
  });

  testWidgets('10. Dữ liệu hợp lệ - Số điện thoại 11 số', (tester) async {
    await tester.pumpWidget(const GetMaterialApp(home: RegisterScreen()));

    await fillRegisterForm(
      tester,
      username: 'Tran Thi B',
      email: 'tranthib@outlook.com',
      password: 'securePass123',
      phone: '09123456789', // 11 số → vẫn hợp lệ
    );

    final buttonFinder = find.text('Đăng ký');
    await tester.ensureVisible(buttonFinder);
    await tester.pumpAndSettle();

    await tester.tap(buttonFinder);
    await tester.pump();
    await tester.pumpAndSettle();
    await Future.delayed(const Duration(seconds: 2));
    expect(
      find.text("Let’s Connect With Us!", findRichText: true),
      findsOneWidget,
    );
  });
}
