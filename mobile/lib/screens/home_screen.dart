import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/home_controller.dart';
import '../widgets/bottom_nav.dart';

class HomeScreen extends StatelessWidget {
  HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final HomeController controller = Get.find<HomeController>();
    return Scaffold(
      body: Obx(() => controller.pages[controller.selectedIndex.value]),
      bottomNavigationBar: myBottomNav(onTabChange: controller.onItemTapped),
    );
  }
}
