import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/controller/field_search_controller.dart';
import 'package:mobile/models/sport_category.dart';
import 'package:mobile/controller/store_controller.dart';

class SportCategoryController extends GetxController {
  final Rx<String?> selectedCategory = Rx<String?>(null);
  final Rx<String?> selectedCategoryId = Rx<String?>(null);
  final RxList<SportCategory> categories = <SportCategory>[].obs;
  final RxBool isLoading = false.obs;

  late StoreController storeController;
  late FieldSearchController fieldSearchController;

  @override
  void onReady() {
    super.onReady();
    fieldSearchController =
        Get.find<FieldSearchController>(); // ✔ KHÔNG gọi trong onInit
  }

  @override
  void onInit() {
    super.onInit();
    storeController = Get.find<StoreController>();
    fetchCategoriesFromAPI();
  }

  /// Lấy danh mục từ API
  Future<void> fetchCategoriesFromAPI() async {
    try {
      isLoading.value = true;
      final response = await http.get(
        Uri.parse('http://www.executexan.store/sports'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        categories.value = data.map((e) {
          final Map<String, dynamic> item = e;
          return SportCategory(
            id: item['id'],
            name: item['name'],
            icon: getIconById(item['id']),
            color: _getColorById(item['id']),
          );
        }).toList();
      } else {
        Get.snackbar(
          'Lỗi',
          'Không thể tải danh mục (status: ${response.statusCode})',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red.shade100,
          colorText: Colors.red.shade900,
        );
      }
    } catch (e) {
      Get.snackbar(
        'Lỗi',
        'Không thể tải danh mục: $e',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
    } finally {
      isLoading.value = false;
    }
  }

  /// Lấy icon dựa theo id
  IconData getIconById(String id) {
    switch (id) {
      case 'football':
        return Icons.sports_soccer;
      case 'basketball':
        return Icons.sports_basketball;
      case 'badminton':
      case 'tennis':
        return Icons.sports_tennis;
      case 'pingpong':
        return Icons.sports_tennis_sharp;
      case 'volleyball':
        return Icons.sports_volleyball;
      case 'pickleball':
        return Icons.sports_handball;
      default:
        return Icons.sports;
    }
  }

  /// Lấy màu theo id
  Color _getColorById(String id) {
    switch (id) {
      case 'football':
        return Colors.green;
      case 'basketball':
        return Colors.orange;
      case 'badminton':
        return Colors.purple;
      case 'tennis':
        return Colors.pink;
      case 'pingpong':
        return Colors.blue;
      case 'volleyball':
        return Colors.yellow.shade700;
      case 'pickleball':
        return Colors.teal;
      default:
        return Colors.grey;
    }
  }

  void selectCategory(String categoryName) {
    final isCurrentlySelected = selectedCategory.value == categoryName;

    if (isCurrentlySelected) {
      // Bỏ chọn danh mục
      selectedCategory.value = null;
      selectedCategoryId.value = null;

      // Kiểm tra nếu còn filter khác trong FieldSearchController
      if (fieldSearchController.hasAnyFilter()) {
        fieldSearchController.performSearch();
      } else {
        storeController.fetchStores();
      }
    } else {
      // Chọn danh mục
      selectedCategory.value = categoryName;
      final category = categories.firstWhereOrNull(
        (c) => c.name == categoryName,
      );
      selectedCategoryId.value = category?.id;

      _performStoreSearch();
    }

    onCategoryChanged(selectedCategory.value, selectedCategoryId.value);
  }

  bool isSelected(String categoryName) =>
      selectedCategory.value == categoryName;

  void clearSelection() {
    selectedCategory.value = null;
    selectedCategoryId.value = null;

    if (fieldSearchController.hasAnyFilter()) {
      fieldSearchController.performSearch();
    } else {
      storeController.fetchStores();
    }

    onCategoryChanged(null, null);
  }

  Color? getSelectedColor() {
    if (selectedCategory.value == null) return null;
    final category = categories.firstWhereOrNull(
      (c) => c.name == selectedCategory.value,
    );
    return category?.color;
  }

  void onCategoryChanged(String? category, String? categoryId) {
    if (category != null && categoryId != null) {
      print('Đã chọn danh mục: $category (ID: $categoryId)');
    } else {
      print('Đã bỏ chọn danh mục');
    }
  }

  /// Perform store search with current sport category
  Future<void> _performStoreSearch() async {

    await storeController.searchStores(
      name: storeController.searchQuery.value,
      wardId: storeController.selectedWardId.value.isEmpty
          ? null
          : storeController.selectedWardId.value,
      provinceId: storeController.selectedProvinceId.value.isEmpty
          ? null
          : storeController.selectedProvinceId.value,
      sportId: selectedCategoryId.value ?? '',
    );
  }
}
