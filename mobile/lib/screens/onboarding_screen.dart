import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get/utils.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/screens/home_screen.dart';
import 'package:mobile/screens/login_screen.dart';
import 'package:mobile/utilities/location_helper.dart';
import '../models/onboarding_data.dart';
import '../widgets/onboarding_page_widget.dart';
import '../widgets/page_indicator.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({Key? key}) : super(key: key);

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  PageController _pageController = PageController();
  int _currentPage = 0;
  final List<OnboardingData> _pages = [
    OnboardingData(
      title: "Chào mừng đến với ArenaAxis",
      subtitle: "Ứng dụng đặt sân thể thao thông minh",
      description:
          "Kết nối với cộng đồng thể thao, đặt sân dễ dàng và tìm đối thủ xứng tầm chỉ với vài cú chạm!",
      image: "assets/images/onboarding_1.webp",
      color: Colors.blue,
    ),
    OnboardingData(
      title: "Đặt sân mọi lúc mọi nơi",
      subtitle: "Hàng trăm sân thể thao chất lượng",
      description:
          "Tìm và đặt sân bóng đá, bóng rổ, cầu lông, tennis gần bạn với giá cả hợp lý nhất.",
      image: "assets/images/onboarding_2.webp",
      color: Colors.green,
    ),
    OnboardingData(
      title: "Ghép đội & Tìm đối thủ",
      subtitle: "Kết nối cộng đồng thể thao",
      description:
          "Tham gia các nhóm, ghép đội với những người chơi cùng trình độ và tổ chức những trận đấu thú vị.",
      image: "assets/images/onboarding_3.webp",
      color: Colors.orange,
    ),
    OnboardingData(
      title: "Quản lý lịch thi đấu",
      subtitle: "Theo dõi hoạt động thể thao",
      description:
          "Lưu lịch sử các trận đấu, thống kê thành tích và xây dựng danh tiếng trong cộng đồng.",
      image: "assets/images/onboarding_4.webp",
      color: Colors.purple,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              _pages[_currentPage].color.withOpacity(0.8),
              _pages[_currentPage].color.withOpacity(0.3),
              Colors.white,
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Skip button
              Padding(
                padding: const EdgeInsets.all(15.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'ArenaAxis',
                      style: GoogleFonts.workbench(
                        fontSize: 32,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        shadows: [
                          Shadow(
                            offset: Offset(4, 5),
                            blurRadius: 4,
                            color: _pages[_currentPage].color,
                          ),
                        ],
                        letterSpacing: 2,
                      ),
                    ),

                    InkWell(
                      key: const Key('skipOnboardingButton'), // thêm key
                      onTap: _goToLogin,
                      child: Text(
                        'Bỏ qua',
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 20,
                          shadows: [
                            Shadow(
                              offset: const Offset(2, 3),
                              blurRadius: 3,
                              color: _pages[_currentPage].color,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // PageView
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (index) {
                    setState(() {
                      _currentPage = index;
                    });
                  },
                  itemCount: _pages.length,
                  itemBuilder: (context, index) {
                    return OnboardingPageWidget(
                      data: _pages[index],
                      currentPage: _currentPage,
                    );
                  },
                ),
              ),

              // Page indicator
              PageIndicator(
                currentPage: _currentPage,
                pageCount: _pages.length,
                activeColor: _pages[_currentPage].color,
              ),

              const SizedBox(height: 25),

              // Bottom buttons
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 30),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Previous button
                    _currentPage > 0
                        ? TextButton(
                            onPressed: _previousPage,
                            child: const Text(
                              'Quay lại',
                              style: TextStyle(
                                color: Colors.black54,
                                fontSize: 16,
                              ),
                            ),
                          )
                        : const SizedBox(width: 80),

                    // Next/Get Started button
                    ElevatedButton(
                      onPressed: _currentPage == _pages.length - 1
                          ? _goToLogin
                          : _nextPage,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _pages[_currentPage].color,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 30,
                          vertical: 15,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(25),
                        ),
                        elevation: 2,
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            _currentPage == _pages.length - 1
                                ? 'Bắt đầu'
                                : 'Tiếp theo',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(width: 8),
                          const Icon(Icons.arrow_forward, size: 18),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  void _nextPage() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _previousPage() {
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _goToLogin() {
    Get.to(() => LoginScreen());
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }
}
