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

class _ProfilePageState extends State<ProfilePage> {
  late final TokenStorage tokenStorage;
  late final FlutterSecureStorage secureStorage;
  late final AuthService authService;

  bool? isLoggedIn;
  User? currentUser;

  @override
  void initState() {
    super.initState();
    secureStorage = const FlutterSecureStorage();
    tokenStorage = TokenStorage(storage: secureStorage);
    authService = AuthService();
    _checkLoginStatus();
  }

  // Kiểm tra trạng thái đăng nhập
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

      // Nếu đã đăng nhập → refresh dữ liệu user từ server
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
      }
    }
  }

  // Load thông tin user từ API
  Future<void> _loadUserData(String token, {bool background = false}) async {
    try {
      final user = await authService.getCurrentUser(token);
      if (user == null) return;

      // Lưu vào secure storage
      await secureStorage.write(
        key: TokenStorage.USER_KEY,
        value: jsonEncode(user.toJson()),
      );

      // Chỉ cập nhật UI nếu widget còn tồn tại
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
    final size = MediaQuery.of(context).size;

    // Đang kiểm tra trạng thái
    if (isLoggedIn == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    // Chưa đăng nhập
    if (!isLoggedIn!) {
      return _buildNotLoggedInScreen(size);
    }

    // Đang load user lần đầu
    if (currentUser == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    // Đã đăng nhập + có dữ liệu → hiển thị profile
    return _buildLoggedInScreen(size);
  }

  // ===================================================================
  // MÀN HÌNH CHƯA ĐĂNG NHẬP
  // ===================================================================
  Widget _buildNotLoggedInScreen(Size size) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: EdgeInsets.all(size.width * 0.08),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: size.width * 0.25,
                  height: size.width * 0.25,
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.lock_outline, size: size.width * 0.12, color: Colors.blue),
                ),
                SizedBox(height: size.height * 0.04),
                Text(
                  'Bạn chưa đăng nhập',
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: size.height * 0.02),
                Text(
                  'Vui lòng đăng nhập để xem thông tin cá nhân, lịch sử đặt sân và nhiều tính năng khác',
                  style: TextStyle(fontSize: 16, color: Colors.grey[600], height: 1.5),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: size.height * 0.08),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () {
                      Get.to(() => const LoginScreen())?.then((_) => _checkLoginStatus());
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text('Đăng nhập', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                  ),
                ),
                SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: OutlinedButton(
                    onPressed: () => Get.to(() => const RegisterScreen()),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: Colors.blue, width: 2),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text('Đăng ký', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blue)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ===================================================================
  // MÀN HÌNH ĐÃ ĐĂNG NHẬP
  // ===================================================================
  Widget _buildLoggedInScreen(Size size) {
    final user = currentUser!;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: size.height * 0.3,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.asset(
                    'assets/images/background.webp',
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(color: Colors.blueGrey.shade700),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, Colors.black.withOpacity(0.7)],
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 16,
                    left: 16,
                    right: 16,
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: size.width * 0.08,
                          backgroundColor: Colors.blue,
                          child: Text(
                            user.name.isNotEmpty ? user.name[0].toUpperCase() : 'U',
                            style: TextStyle(fontSize: size.width * 0.08, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                        ),
                        SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                user.name,
                                style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                                overflow: TextOverflow.ellipsis,
                              ),
                              SizedBox(height: 4),
                              Text(
                                user.email,
                                style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 14),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.all(size.width * 0.04),
              child: Column(
                children: [
                  _buildSection('Thông tin cá nhân', [
                    _menuItem(Icons.person_outline, 'Chỉnh sửa thông tin'),
                    _menuItem(
                      Icons.phone_outlined,
                      'Số điện thoại',
                      value: user.phone?.isNotEmpty == true ? user.phone : 'Chưa có số điện thoại',
                      showChevron: user.phone?.isNotEmpty != true,
                    ),
                    _menuItem(Icons.location_on_outlined, 'Địa chỉ'),
                  ]),

                  SizedBox(height: 16),

                  _buildSection('Hoạt động', [
                    _menuItem(Icons.history, 'Lịch sử đặt sân'),
                    _menuItem(Icons.group_outlined, 'Đội của tôi'),
                    _menuItem(Icons.favorite_outline, 'Sân yêu thích'),
                  ]),

                  SizedBox(height: 16),

                  _buildSection('Cài đặt', [
                    _menuItem(Icons.notifications_outlined, 'Thông báo'),
                    _menuItem(Icons.lock_outline, 'Bảo mật'),
                    _menuItem(Icons.help_outline, 'Trợ giúp'),
                    _menuItem(Icons.logout, 'Đăng xuất', color: Colors.red),
                  ]),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> items) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 8, offset: Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ),
          const Divider(height: 1),
          ...items,
        ],
      ),
    );
  }

  Widget _menuItem(IconData icon, String title, {String? value, bool showChevron = true, Color? color}) {
    return InkWell(
      onTap: () {
        if (title == 'Đăng xuất') {
          _showLogoutDialog();
        }
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Icon(icon, size: 24, color: color ?? Colors.blue),
            const SizedBox(width: 16),
            Expanded(child: Text(title, style: TextStyle(fontSize: 16))),
            if (value != null) ...[
              Text(value, style: TextStyle(color: Colors.grey[600], fontSize: 15)),
              const SizedBox(width: 8),
            ],
            if (showChevron)
              Icon(Icons.chevron_right, color: Colors.grey),
          ],
        ),
      ),
    );
  }

  // ===================================================================
  // DIALOG & LOGOUT
  // ===================================================================
  void _showLogoutDialog() {
    Get.dialog(
      AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Đăng xuất'),
        content: const Text('Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này?'),
        actions: [
          TextButton(onPressed: () => Get.back(), child: const Text('Hủy')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              Get.back();
              _logout();
            },
            child: const Text('Đăng xuất'),
          ),
        ],
      ),
    );
  }

  // ĐÃ SỬA LỖI setState() after dispose() TẠI ĐÂY
  Future<void> _logout() async {
    await tokenStorage.clear();

    // Reset tab về Home
    if (Get.isRegistered<HomeController>()) {
      Get.find<HomeController>().selectedIndex.value = 0;
    }

    // Chuyển về trang chủ và xóa toàn bộ stack
    Get.offAll(() =>  HomeScreen());

    // Không gọi setState() ở đây nữa → widget đã bị dispose
    // Lần sau vào lại tab Profile → initState() sẽ tự kiểm tra và hiện "Chưa đăng nhập"
  }

  @override
  void dispose() {
    // Không cần gì ở đây vì không có stream/timer
    super.dispose();
  }
}