import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/sport_category_controller.dart';
import 'package:mobile/widgets/loading.dart';
import 'package:mobile/widgets/sport_category_item.dart';

class SportCategoryList extends GetView<SportCategoryController> {
  final Size screenSize;
  final double? height;
  final EdgeInsets? padding;

  const SportCategoryList({
    Key? key,
    required this.screenSize,
    this.height,
    this.padding,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height ?? screenSize.height * 0.115,
      child: Obx(() {
        if (controller.isLoading.value) {
          return loadingIndicator();
        }

        if (controller.categories.isEmpty) {
          return _buildEmptyState();
        }

        return _buildCategoryList();
      }),
    );
  }


  Widget _buildEmptyState() {
    return Center(
      child: Text(
        'Không có danh mục nào',
        style: TextStyle(
          color: Colors.grey[600],
          fontSize: 14,
        ),
      ),
    );
  }

  Widget _buildCategoryList() {
    return ListView.builder(
      scrollDirection: Axis.horizontal,
      padding: padding ??
          EdgeInsets.symmetric(
            horizontal: screenSize.width * 0.045,
          ),
      itemCount: controller.categories.length,
      itemBuilder: (context, index) {
        final category = controller.categories[index];
        return Obx(() => SportCategoryItem(
              category: category,
              screenSize: screenSize,
              isSelected: controller.isSelected(category.name),
              onTap: () => controller.selectCategory(category.name),
            ));
      },
    );
  }
}
