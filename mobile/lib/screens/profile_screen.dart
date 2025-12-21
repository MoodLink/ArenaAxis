import 'dart:convert';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/home_controller.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/screens/home_screen.dart';
import 'package:mobile/screens/login_screen.dart';
import 'package:mobile/screens/register_screen.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/utilities/token_storage.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage>
    with SingleTickerProviderStateMixin {
  late final TokenStorage tokenStorage;
  late final FlutterSecureStorage secureStorage;
  late final AuthService authService;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  bool? isLoggedIn;
  User? currentUser;

  @override
  void initState() {
    super.initState();
    secureStorage = const FlutterSecureStorage();
    tokenStorage = TokenStorage(storage: secureStorage);
    authService = AuthService();

    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOut),
    );

    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    try {
      final token = await tokenStorage.getAccessToken();
      final localUser = await tokenStorage.getUserData();

      log('Access token exists: ${token != null && token.isNotEmpty}');
      log('Local user: ${localUser?.name}');

      final bool loggedIn = token != null && token.isNotEmpty;

      if (!mounted) return;

      setState(() {
        isLoggedIn = loggedIn;
        currentUser = localUser;
      });

      _animationController.forward();

      if (loggedIn && token != null) {
        _loadUserData(token, background: currentUser != null);
      }
    } catch (e) {
      log('Error checking login status: $e');
      if (mounted) {
        setState(() {
          isLoggedIn = false;
          currentUser = null;
        });
        _animationController.forward();
      }
    }
  }

  Future<void> _loadUserData(String token, {bool background = false}) async {
    try {
      final user = await authService.getCurrentUser(token);
      if (user == null) return;

      await secureStorage.write(
        key: TokenStorage.USER_KEY,
        value: jsonEncode(user.toJson()),
      );

      if (mounted) {
        setState(() {
          currentUser = user;
        });
      }
    } catch (e) {
      log('Error loading user data: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoggedIn == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (!isLoggedIn!) {
      return _buildNotLoggedInScreen();
    }

    if (currentUser == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return _buildLoggedInScreen();
  }

  // ===================================================================
  // MÀN HÌNH CHƯA ĐĂNG NHẬP
  // ===================================================================
  Widget _buildNotLoggedInScreen() {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.blue.shade600, Colors.blue.shade400],
          ),
        ),
        child: SafeArea(
          child: FadeTransition(
            opacity: _fadeAnimation,
            child: LayoutBuilder(
              builder: (context, constraints) {
                return Center(
                  child: SingleChildScrollView(
                    padding: EdgeInsets.symmetric(
                      horizontal: constraints.maxWidth * 0.08,
                      vertical: 24,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Icon
                        Container(
                          width: constraints.maxWidth * 0.3,
                          height: constraints.maxWidth * 0.3,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.sports_soccer,
                            size: constraints.maxWidth * 0.15,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: constraints.maxHeight * 0.05),

                        Text(
                          'Chào mừng!',
                          style: TextStyle(
                            fontSize: constraints.maxWidth * 0.08,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: 12),

                        Text(
                          'Đăng nhập để đặt sân thể thao',
                          style: TextStyle(
                            fontSize: constraints.maxWidth * 0.04,
                            color: Colors.white.withOpacity(0.9),
                          ),
                          textAlign: TextAlign.center,
                        ),

                        SizedBox(height: constraints.maxHeight * 0.08),

                        // Login Button
                        SizedBox(
                          width: double.infinity,
                          height: 54,
                          child: ElevatedButton(
                            onPressed: () {
                              Get.to(
                                () => const LoginScreen(),
                              )?.then((_) => _checkLoginStatus());
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: Colors.blue.shade600,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text(
                              'Đăng nhập',
                              style: TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 14),

                        // Register Button
                        SizedBox(
                          width: double.infinity,
                          height: 54,
                          child: OutlinedButton(
                            onPressed: () =>
                                Get.to(() => const RegisterScreen()),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Colors.white,
                              side: const BorderSide(
                                color: Colors.white,
                                width: 2,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text(
                              'Đăng ký',
                              style: TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ),
      ),
    );
  }

  // ===================================================================
  // MÀN HÌNH ĐÃ ĐĂNG NHẬP
  // ===================================================================
  Widget _buildLoggedInScreen() {
    final user = currentUser!;

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: LayoutBuilder(
          builder: (context, constraints) {
            final headerHeight = constraints.maxHeight * 0.25;

            return CustomScrollView(
              slivers: [
                // Header với Avatar
                SliverToBoxAdapter(
                  child: Container(
                    height: headerHeight,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [Colors.blue.shade600, Colors.blue.shade400],
                      ),
                    ),
                    child: SafeArea(
                      child: Padding(
                        padding: EdgeInsets.symmetric(
                          horizontal: constraints.maxWidth * 0.05,
                          vertical: 20,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Row(
                              children: [
                                // Avatar
                                Container(
                                  width: constraints.maxWidth * 0.16,
                                  height: constraints.maxWidth * 0.16,
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                  ),
                                  child: Center(
                                    child: Text(
                                      user.name.isNotEmpty
                                          ? user.name[0].toUpperCase()
                                          : 'U',
                                      style: TextStyle(
                                        fontSize: constraints.maxWidth * 0.08,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.blue.shade600,
                                      ),
                                    ),
                                  ),
                                ),
                                SizedBox(width: constraints.maxWidth * 0.04),

                                // Tên và Email
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        user.name,
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        user.email,
                                        style: TextStyle(
                                          color: Colors.white.withOpacity(0.9),
                                          fontSize: 14,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),

                // Menu Items
                SliverPadding(
                  padding: EdgeInsets.all(constraints.maxWidth * 0.04),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      // Thông tin cá nhân
                      _menuItem(
                        Icons.person_outline,
                        'Thông tin cá nhân',
                        Colors.blue,
                        subtitle: user.phone?.isNotEmpty == true
                            ? user.phone
                            : 'Chưa cập nhật số điện thoại',
                      ),
                      const SizedBox(height: 12),

                      _menuItem(
                        Icons.favorite_border,
                        'Sân yêu thích',
                        Colors.green,
                      ),
                      const SizedBox(height: 12),

                      // Cài đặt
                      _menuItem(
                        Icons.settings_outlined,
                        'Cài đặt',
                        Colors.grey,
                      ),
                      const SizedBox(height: 12),

                      // Trợ giúp
                      _menuItem(Icons.help_outline, 'Trợ giúp', Colors.orange),
                      const SizedBox(height: 24),

                      // Nút Đăng xuất
                      _logoutButton(),
                      const SizedBox(height: 40),
                    ]),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _menuItem(
    IconData icon,
    String title,
    Color color, {
    String? subtitle,
  }) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: () {},
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 22),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    if (subtitle != null) ...[
                      const SizedBox(height: 3),
                      Text(
                        subtitle,
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              Icon(Icons.chevron_right, color: Colors.grey.shade400, size: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _logoutButton() {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: _showLogoutDialog,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.logout, color: Colors.red, size: 22),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Text(
                  'Đăng xuất',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.red,
                  ),
                ),
              ),
              const Icon(Icons.chevron_right, color: Colors.red, size: 20),
            ],
          ),
        ),
      ),
    );
  }

  void _showLogoutDialog() {
    Get.dialog(
      AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Đăng xuất'),
        content: const Text('Bạn có chắc chắn muốn đăng xuất?'),
        actionsAlignment: MainAxisAlignment.spaceBetween,
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white60,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            onPressed: () => Get.back(),
            child: const Text('Hủy'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            onPressed: () {
              Get.back();
              _logout();
            },
            child: const Text(
              'Đăng xuất',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

Future<void> _logout() async {
  await tokenStorage.clear();

  Get.deleteAll(force: true);

  Get.offAll(() => HomeScreen());
}


  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }
}
