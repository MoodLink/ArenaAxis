import 'dart:convert';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/home_controller.dart';
import 'package:mobile/screens/home_screen.dart';
import 'package:mobile/screens/login_screen.dart';
import 'package:mobile/screens/register_screen.dart';
import 'package:mobile/utilities/token_storage.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/models/user.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();  
}

class _ProfilePageState extends State<ProfilePage> {
  late TokenStorage tokenStorage;
  late FlutterSecureStorage secureStorage;
  late AuthService authService;
  bool? isLoggedIn;
  User? currentUser;
  bool isLoadingUser = false; // Theo dõi trạng thái load từ API

  @override
  void initState() {
    super.initState();
    secureStorage = const FlutterSecureStorage();
    tokenStorage = TokenStorage(storage: secureStorage);
    // Giả định AuthService đã được khởi tạo đúng cách
    authService = AuthService(); 
    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    try {
      final token = await tokenStorage.getAccessToken();
      // 1. Ưu tiên lấy user từ bộ nhớ cục bộ
      final localUser = await tokenStorage.getUserData(); 
      log('Local user data: ${localUser?.toJson()}');
      log('access token: $token');
      final isCurrentlyLoggedIn = token != null && token.isNotEmpty;

      setState(() {
        isLoggedIn = isCurrentlyLoggedIn;
        // 2. Gán user từ local ngay lập tức nếu đã đăng nhập
        if (isLoggedIn == true) {
          currentUser = localUser as User?; 
        }
      });

      // 3. Nếu đã login nhưng CHƯA CÓ dữ liệu local, thì gọi API để lấy và lưu cache
      if (isLoggedIn == true && token != null && currentUser == null) {
        log('User data not found locally. Fetching from API...');
        await _loadUserData(token); 
      } 
      
      // 4. Nếu đã có local user, chạy API ngầm để refresh data
      else if (isLoggedIn == true && token != null && currentUser != null) {
        // Không chờ kết quả, chạy ở chế độ background để tránh blocking UI
        _loadUserData(token, background: true);
      }

    } catch (e) {
      log('Error checking login status: $e');
      setState(() {
        isLoggedIn = false;
        currentUser = null;
      });
    }
  }

  Future<void> _loadUserData(String token, {bool background = false}) async {
    if (!background) {
      setState(() {
        isLoadingUser = true;
      });
    }

    try {
      // Thay vì lấy từ local, gọi API để fetch user data (giả định AuthService có method getUser)
      final user = await authService.getCurrentUser(token); 
      if (user != null) {
        // Lưu vào secure storage để cache
        await secureStorage.write(key: TokenStorage.USER_KEY, value: jsonEncode(user.toJson()));
      }
      setState(() {
        currentUser = user;
        // Tắt loading nếu không phải background
        if (!background) {
          isLoadingUser = false;
        }
      });
    } catch (e) {
      log('Error loading user data: $e');
      
      if (!background) {
        setState(() {
          isLoadingUser = false;
        });
      }

    }
  }

  @override
  Widget build(BuildContext context) {
    final Size screenSize = MediaQuery.of(context).size;

    // 1. Loading ban đầu (kiểm tra trạng thái đăng nhập)
    if (isLoggedIn == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    // 2. Chưa đăng nhập
    if (!isLoggedIn!) {
      return _buildNotLoggedInScreen(screenSize);
    }

    // 3. Đã đăng nhập nhưng đang chờ dữ liệu user (chỉ xảy ra khi không có cache)
    if (currentUser == null && isLoadingUser) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    // 4. Đã đăng nhập và có dữ liệu user (hoặc load từ cache)
    return _buildProfileScreen(screenSize);
  }

  // --- Widget chưa đăng nhập ---
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
                  SizedBox(
                    width: double.infinity,
                    height: screenSize.height * 0.07,
                    child: ElevatedButton(
                      onPressed: () {
                        // Refresh state sau khi quay lại từ LoginScreen
                        Get.to(() => const LoginScreen())?.then((_) => _checkLoginStatus()); 
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
                  SizedBox(
                    width: double.infinity,
                    height: screenSize.height * 0.07,
                    child: OutlinedButton(
                      onPressed: () {
                        Get.to(() => const RegisterScreen());
                      },
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Colors.blue, width: 2),
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

  // --- Widget đã đăng nhập ---
  Widget _buildProfileScreen(Size screenSize) {
    // Đảm bảo currentUser không null trước khi truy cập
    final user = currentUser!; 
    
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
                    errorBuilder: (context, error, stackTrace) => Container(color: Colors.blueGrey.shade700),
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
                    child: isLoadingUser 
                        ? Center(
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  CircleAvatar(
                                    radius: screenSize.width * 0.08,
                                    backgroundColor: Colors.blue,
                                    child: Text(
                                      user.name.isNotEmpty
                                          ? user.name.substring(0, 1).toUpperCase()
                                          : 'U',
                                      style: TextStyle(
                                        fontSize: screenSize.width * 0.08,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                  SizedBox(width: screenSize.width * 0.04),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          user.name,
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: screenSize.width * 0.05,
                                            fontWeight: FontWeight.bold,
                                          ),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        SizedBox(height: screenSize.height * 0.005),
                                        Text(
                                          user.email,
                                          style: TextStyle(
                                            color: Colors.white.withOpacity(0.8),
                                            fontSize: screenSize.width * 0.035,
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
                    // Hiển thị số điện thoại
                    _buildMenuItem(
                      Icons.phone_outlined,
                      'Số điện thoại',
                      screenSize,
                      showChevron: user.phone == null,
                      value: user.phone ?? 'Chưa có số điện thoại',
                    ),
                    _buildMenuItem(
                      Icons.location_on_outlined,
                      'Địa chỉ',
                      screenSize,
                    ),
                  ], screenSize),
                  SizedBox(height: screenSize.height * 0.02),
                  _buildProfileSection('Hoạt động', [
                    _buildMenuItem(Icons.history, 'Lịch sử đặt sân', screenSize),
                    _buildMenuItem(Icons.group_outlined, 'Đội của tôi', screenSize),
                    _buildMenuItem(Icons.favorite_outline, 'Sân yêu thích', screenSize),
                  ], screenSize),
                  SizedBox(height: screenSize.height * 0.02),
                  _buildProfileSection('Cài đặt', [
                    _buildMenuItem(Icons.notifications_outlined, 'Thông báo', screenSize),
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
        color: Theme.of(context).cardColor,
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
                color: Theme.of(context).textTheme.bodyLarge?.color,
              ),
            ),
          ),
          const Divider(height: 1, indent: 16, endIndent: 16),
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
    bool showChevron = true,
    String? value,
  }) {
    final textColor = color ?? Theme.of(context).textTheme.bodyMedium?.color;
    
    // Nếu có value, không hiển thị chevron (trừ khi showChevron được set riêng)
    final displayChevron = showChevron && value == null;

    return InkWell(
      onTap: () {
        if (title == 'Đăng xuất') {
          _showLogoutDialog(context);
        }
        // Thêm logic navigation cho các mục khác
      },
      child: Padding(
        padding: EdgeInsets.symmetric(
          horizontal: screenSize.width * 0.04,
          vertical: screenSize.height * 0.015,
        ),
        child: Row(
          children: [
            Icon(icon, size: screenSize.width * 0.06, color: color ?? Colors.blue),
            SizedBox(width: screenSize.width * 0.03),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  fontSize: screenSize.width * 0.04, 
                  color: textColor,
                  fontWeight: FontWeight.normal,
                ),
              ),
            ),
            // Hiển thị giá trị thông tin ở phía phải nếu có
            if (value != null)
              Text(
                value,
                style: TextStyle(
                  fontSize: screenSize.width * 0.04,
                  color: Colors.grey[600],
                ),
              ),
            if (value != null) SizedBox(width: screenSize.width * 0.02),
            // Hiển thị mũi tên nếu cần
            if (showChevron && (value == null || value.startsWith('Chưa có')))
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
      barrierDismissible: false,
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
                  child: const Icon(
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

    // Reset GetX controller state
    HomeController controller;
    if (Get.isRegistered<HomeController>()) {
      controller = Get.find<HomeController>();
    } else {
      // Khởi tạo nếu chưa có
      controller = Get.put(HomeController());
    }
    controller.selectedIndex.value = 0; 

    // Chuyển về màn hình chính và xóa lịch sử navigation
    Get.offAll(() =>  HomeScreen()); 
    
    setState(() {
      isLoggedIn = false;
      currentUser = null;
    });
  }
}
