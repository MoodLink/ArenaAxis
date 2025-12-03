
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/sport_category_controller.dart';

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

        ],
      ),
    );
  }
}