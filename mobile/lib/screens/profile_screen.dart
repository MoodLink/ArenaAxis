import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import 'package:get/utils.dart';
import 'package:mobile/controller/home_controller.dart';
import 'package:mobile/screens/home_screen.dart';
import 'package:mobile/screens/login_screen.dart';
import 'package:mobile/screens/register_screen.dart';
import 'package:mobile/utilities/token_storage.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  late TokenStorage tokenStorage;
  late FlutterSecureStorage secureStorage;
  bool? isLoggedIn;

  @override
  void initState() {
    super.initState();
    secureStorage = const FlutterSecureStorage();
    tokenStorage = TokenStorage(storage: secureStorage);
    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    try {
      final token = await tokenStorage.getAccessToken();
      setState(() {
        isLoggedIn = token != null && token.isNotEmpty;
      });
    } catch (e) {
      setState(() {
        isLoggedIn = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final Size screenSize = MediaQuery.of(context).size;

    // Hiển thị loading khi đang kiểm tra trạng thái đăng nhập
    if (isLoggedIn == null) {
      return Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    // Hiển thị giao diện hướng dẫn đăng nhập khi chưa login
    if (!isLoggedIn!) {
      return _buildNotLoggedInScreen(screenSize);
    }

    // Hiển thị trang profile khi đã login
    return _buildProfileScreen(screenSize);
  }

  Widget _buildNotLoggedInScreen(Size screenSize) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: EdgeInsets.all(screenSize.width * 0.08),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Icon
                  Container(
                    width: screenSize.width * 0.25,
                    height: screenSize.width * 0.25,
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.lock_outline,
                      size: screenSize.width * 0.12,
                      color: Colors.blue,
                    ),
                  ),
                  SizedBox(height: screenSize.height * 0.04),

                  // Tiêu đề
                  Text(
                    'Bạn chưa đăng nhập',
                    style: TextStyle(
                      fontSize: screenSize.width * 0.08,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: screenSize.height * 0.02),

                  // Mô tả
                  Text(
                    'Vui lòng đăng nhập để xem thông tin cá nhân, lịch sử đặt sân và nhiều tính năng khác',
                    style: TextStyle(
                      fontSize: screenSize.width * 0.04,
                      color: Colors.grey[600],
                      height: 1.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: screenSize.height * 0.08),

                  // Nút Đăng nhập
                  SizedBox(
                    width: double.infinity,
                    height: screenSize.height * 0.07,
                    child: ElevatedButton(
                      onPressed: () {
                        Get.to(LoginScreen()); // Điều hướng đến trang login
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        'Đăng nhập',
                        style: TextStyle(
                          fontSize: screenSize.width * 0.045,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: screenSize.height * 0.02),

                  // Nút Đăng ký
                  SizedBox(
                    width: double.infinity,
                    height: screenSize.height * 0.07,
                    child: OutlinedButton(
                      onPressed: () {
                        Get.to(RegisterScreen());
                      },
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: Colors.blue, width: 2),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        'Đăng ký',
                        style: TextStyle(
                          fontSize: screenSize.width * 0.045,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: screenSize.height * 0.04),

                  // Văn bản hỗ trợ
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.info_outline,
                        size: screenSize.width * 0.04,
                        color: Colors.grey[500],
                      ),
                      SizedBox(width: screenSize.width * 0.02),
                      Expanded(
                        child: Text(
                          'Cần giúp đỡ? Liên hệ với chúng tôi',
                          style: TextStyle(
                            fontSize: screenSize.width * 0.035,
                            color: Colors.grey[600],
                          ),
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
    );
  }

  Widget _buildProfileScreen(Size screenSize) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: screenSize.height * 0.3,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.asset(
                    'assets/images/background.webp',
                    fit: BoxFit.cover,
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withOpacity(0.7),
                        ],
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: screenSize.height * 0.02,
                    left: screenSize.width * 0.04,
                    right: screenSize.width * 0.04,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              radius: screenSize.width * 0.08,
                              backgroundImage: Image.asset(
                                'assets/images/avatar.webp',
                              ).image,
                            ),
                            SizedBox(width: screenSize.width * 0.04),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Lê Thị Mỹ Hạnh',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: screenSize.width * 0.05,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(height: screenSize.height * 0.005),
                                Text(
                                  'Hanhxinhdep@gmail.com',
                                  style: TextStyle(
                                    color: Colors.white.withOpacity(0.8),
                                    fontSize: screenSize.width * 0.035,
                                  ),
                                ),
                              ],
                            ),
                          ],
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
              padding: EdgeInsets.all(screenSize.width * 0.04),
              child: Column(
                children: [
                  _buildProfileSection('Thông tin cá nhân', [
                    _buildMenuItem(
                      Icons.person_outline,
                      'Chỉnh sửa thông tin',
                      screenSize,
                    ),
                    _buildMenuItem(
                      Icons.phone_outlined,
                      'Số điện thoại',
                      screenSize,
                    ),
                    _buildMenuItem(
                      Icons.location_on_outlined,
                      'Địa chỉ',
                      screenSize,
                    ),
                  ], screenSize),
                  SizedBox(height: screenSize.height * 0.02),
                  _buildProfileSection('Hoạt động', [
                    _buildMenuItem(
                      Icons.history,
                      'Lịch sử đặt sân',
                      screenSize,
                    ),
                    _buildMenuItem(
                      Icons.group_outlined,
                      'Đội của tôi',
                      screenSize,
                    ),
                    _buildMenuItem(
                      Icons.favorite_outline,
                      'Sân yêu thích',
                      screenSize,
                    ),
                  ], screenSize),
                  SizedBox(height: screenSize.height * 0.02),
                  _buildProfileSection('Cài đặt', [
                    _buildMenuItem(
                      Icons.notifications_outlined,
                      'Thông báo',
                      screenSize,
                    ),
                    _buildMenuItem(Icons.lock_outline, 'Bảo mật', screenSize),
                    _buildMenuItem(Icons.help_outline, 'Trợ giúp', screenSize),
                    _buildMenuItem(
                      Icons.logout,
                      'Đăng xuất',
                      screenSize,
                      color: Colors.red,
                    ),
                  ], screenSize),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileSection(
    String title,
    List<Widget> items,
    Size screenSize,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsets.all(screenSize.width * 0.04),
            child: Text(
              title,
              style: TextStyle(
                fontSize: screenSize.width * 0.045,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const Divider(height: 1),
          ...items,
        ],
      ),
    );
  }

  Widget _buildMenuItem(
    IconData icon,
    String title,
    Size screenSize, {
    Color? color,
  }) {
    return InkWell(
      onTap: () {
        if (title == 'Đăng xuất') {
          _showLogoutDialog(context);
        }
      },
      child: Padding(
        padding: EdgeInsets.symmetric(
          horizontal: screenSize.width * 0.04,
          vertical: screenSize.height * 0.02,
        ),
        child: Row(
          children: [
            Icon(icon, size: screenSize.width * 0.06, color: color),
            SizedBox(width: screenSize.width * 0.03),
            Text(
              title,
              style: TextStyle(fontSize: screenSize.width * 0.04, color: color),
            ),
            const Spacer(),
            Icon(
              Icons.chevron_right,
              size: screenSize.width * 0.05,
              color: Colors.grey,
            ),
          ],
        ),
      ),
    );
  }
Future<void> _showLogoutDialog(BuildContext context) async {
  await showDialog(
    context: context,
    barrierDismissible: false, // không tắt khi chạm ngoài
    builder: (context) {
      final isDark = Theme.of(context).brightness == Brightness.dark;

      return Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                decoration: BoxDecoration(
                  color: isDark ? Colors.blueGrey.shade800 : Colors.blue.shade50,
                  shape: BoxShape.circle,
                ),
                padding: const EdgeInsets.all(16),
                child: Icon(
                  Icons.logout_rounded,
                  color: Colors.redAccent,
                  size: 40,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Đăng xuất?',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : Colors.black87,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 15,
                  color: isDark ? Colors.grey[300] : Colors.grey[700],
                ),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: Colors.grey.shade400),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Hủy'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.redAccent,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed: () async {
                        Navigator.pop(context);
                        await _logout();
                      },
                      child: const Text('Đăng xuất'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    },
  );
}

Future<void> _logout() async {
  await tokenStorage.clear();

  HomeController controller;
  if (Get.isRegistered<HomeController>()) {
    controller = Get.find<HomeController>();
  } else {
    controller = Get.put(HomeController());
  }

  controller.selectedIndex.value = 0;
  Get.offAll(() => HomeScreen());
  setState(() {
    isLoggedIn = false;
  });
}

}
