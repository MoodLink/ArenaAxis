
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/providers/sport_category_controller.dart';

class SportCategoryHeader extends GetView<SportCategoryController> {
  final double horizontalPadding;
  final Size screenSize;

  const SportCategoryHeader({
    Key? key,
    required this.horizontalPadding,
    required this.screenSize,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'Môn thể thao',
            style: TextStyle(
              fontSize: screenSize.width * 0.042,
              fontWeight: FontWeight.w600,
              color: Colors.grey[500],
            ),
          ),
          Obx(() => _buildSelectedBadge()),
        ],
      ),
    );
  }

  Widget _buildSelectedBadge() {
    final selected = controller.selectedCategory.value;
    
    if (selected == null) {
      return const SizedBox.shrink();
    }

    final color = controller.getSelectedColor() ?? const Color(0xFF2196F3);

    return GestureDetector(
      onTap: () => controller.clearSelection(),
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: 12,
          vertical: 6,
        ),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: color.withOpacity(0.3),
            width: 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              selected,
              style: TextStyle(
                color: color,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(width: 4),
            Icon(
              Icons.close,
              size: 16,
              color: color,
            ),
          ],
        ),
      ),
    );
  }
}