import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import 'package:get/utils.dart';
import 'package:mobile/controller/home_controller.dart';
import 'package:mobile/models/Authentiacate.dart';
import 'package:mobile/screens/home_screen.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/utilities/token_storage.dart';
import 'package:mobile/widgets/loading.dart';
import '../widgets/login_form.dart';
import '../widgets/login_header.dart';
import '../widgets/social_login_buttons.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => LoginScreenState();
}

class LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  bool _isPasswordVisible = false;
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Container(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.background,
            ),
            child: ScrollConfiguration(
              behavior: ScrollBehavior().copyWith(overscroll: false),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const LoginHeader(),
                    const SizedBox(height: 30),
                    // Social login
                    SocialLoginButtons(
                      onGoogleLogin: () {
                        // Handle Google login
                      },
                      onFacebookLogin: () {
                        // Handle Facebook login
                      },
                    ),
                    const SizedBox(height: 30),
              
                    // Form đăng nhập
                    LoginForm(
                      formKey: _formKey,
                      emailController: emailController,
                      passwordController:passwordController,
                      isPasswordVisible: _isPasswordVisible,
                      onPasswordVisibilityChange: (isVisible) {
                        setState(() {
                          _isPasswordVisible = isVisible;
                        });
                      },
                    ),
                    const SizedBox(height: 20),
              
                    // Nút đăng nhập
                    _buildLoginButton(),
                    const SizedBox(height: 30),
              
                    // Đăng ký
                    _buildRegisterSection(),
                  ],
                ),
              ),
            ),
          ),
          if (_isLoading) (loadingIndicator()),
        ],
      ),
    );
  }

  Widget _buildLoginButton() {
    return Padding(
      padding: const EdgeInsets.all(10.0),
      child: ElevatedButton(
        key: const Key('loginButton'),
        onPressed: _isLoading ? null : _handleLogin,
        style: ElevatedButton.styleFrom(
          backgroundColor: Color(0xFFFD6326),
          foregroundColor: Theme.of(context).colorScheme.onError,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 2,
        ),
        child: Text(
          'Đăng nhập',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Theme.of(context).colorScheme.onSurface,
          ),
        ),
      ),
    );
  }

  Widget _buildRegisterSection() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Chưa có tài khoản? ',
          style: TextStyle(
            color: Theme.of(context).colorScheme.onBackground,
            fontSize: 18,
          ),
        ),
        TextButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const RegisterScreen()),
            );
          },
          child: Text(
            'Đăng ký ngay',
            style: TextStyle(
              color: Color(0xFFFD6326),
              fontSize: 17,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }

void _handleLogin() async {
  if (_formKey.currentState!.validate()) {
    setState(() {
      _isLoading = true;
    });

    final authService = AuthService();
    final tokenStorage = TokenStorage(storage: const FlutterSecureStorage());

    try {
      final authResponse = await authService.login(
        emailController.text.trim(),
       passwordController.text.trim(),
      );

      if (authResponse == null) {
        // ❌ Sai email hoặc mật khẩu
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Email hoặc mật khẩu không chính xác!'),
            backgroundColor: Colors.red,
          ),
        );
      } else {
        // ✅ Lưu token
        await tokenStorage.saveTokens(authResponse);

        // ✅ Chuyển qua trang chủ
        final HomeController controller = Get.find<HomeController>();
        controller.selectedIndex.value = 0;
        Get.offAll(() => HomeScreen());

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Đăng nhập thành công!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e, stack) {
      log('Lỗi đăng nhập: $e\n$stack');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Có lỗi xảy ra: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }
}

  @override
  void dispose() {
    emailController.dispose();
   passwordController.dispose();
    super.dispose();
  }
}
