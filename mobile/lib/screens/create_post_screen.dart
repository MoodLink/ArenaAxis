import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/home_controller.dart';
import 'package:mobile/controller/post_controller.dart';
import 'package:mobile/screens/home_screen.dart';

class CreatePostPage extends StatefulWidget {
  const CreatePostPage({super.key});

  @override
  State<CreatePostPage> createState() => _CreatePostPageState();
}

class _CreatePostPageState extends State<CreatePostPage> {
  final _formKey = GlobalKey<FormState>();
  final controller = Get.find<PostController>();

  // Controllers cho các input
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _requiredNumberController = TextEditingController();
  final _currentNumberController = TextEditingController(text: '0');

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _requiredNumberController.dispose();
    _currentNumberController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final Size screenSize = MediaQuery.of(context).size;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tạo bài tuyển người chơi'),
        centerTitle: true,
        elevation: 0,
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: EdgeInsets.all(screenSize.width * 0.04),
          children: [
            // Thông tin đã chọn
            Card(
              color: Colors.blue.shade50,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: EdgeInsets.all(screenSize.width * 0.04),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.info_outline,
                          color: Colors.blue.shade700,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Đã chọn ${controller.selectedMatchIds.length} trận đấu',
                          style: TextStyle(
                            fontSize: screenSize.width * 0.04,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue.shade900,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Obx(() {
                      return Text(
                        controller.matches
                            .where((m) => controller.selectedMatchIds.contains(m['id']))
                            .map((m) {
                              final date = _formatDate(m['date']);
                              final time = _formatTime(m['startTime'], m['endTime']);
                              return '• $date lúc $time';
                            })
                            .join('\n'),
                        style: TextStyle(
                          fontSize: screenSize.width * 0.035,
                          color: Colors.blue.shade700,
                        ),
                      );
                    }),
                  ],
                ),
              ),
            ),

            SizedBox(height: screenSize.height * 0.03),

            // Tiêu đề bài đăng
            Text(
              'Tiêu đề bài đăng',
              style: TextStyle(
                fontSize: screenSize.width * 0.04,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _titleController,
              decoration: InputDecoration(
                hintText: 'VD: Tuyển người chơi bóng đá',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.grey.shade50,
              ),
              maxLength: 100,
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Vui lòng nhập tiêu đề';
                }
                return null;
              },
            ),

            SizedBox(height: screenSize.height * 0.02),

            // Mô tả
            Text(
              'Mô tả / Trình độ yêu cầu',
              style: TextStyle(
                fontSize: screenSize.width * 0.04,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _descriptionController,
              decoration: InputDecoration(
                hintText: 'VD: Tuyển người chơi trình độ trung bình, biết chơi là được',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.grey.shade50,
              ),
              maxLines: 4,
              maxLength: 500,
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Vui lòng nhập mô tả';
                }
                return null;
              },
            ),

            SizedBox(height: screenSize.height * 0.02),

            // Số người cần tuyển
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Số người cần tuyển',
                        style: TextStyle(
                          fontSize: screenSize.width * 0.04,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _requiredNumberController,
                        decoration: InputDecoration(
                          hintText: '10',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          filled: true,
                          fillColor: Colors.grey.shade50,
                          suffixText: 'người',
                        ),
                        keyboardType: TextInputType.number,
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                        ],
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Nhập số người';
                          }
                          final number = int.tryParse(value);
                          if (number == null || number <= 0) {
                            return 'Số không hợp lệ';
                          }
                          final current = int.tryParse(_currentNumberController.text) ?? 0;
                          if (number <= current) {
                            return 'Phải > số hiện tại';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
                SizedBox(width: screenSize.width * 0.04),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Số người hiện có',
                        style: TextStyle(
                          fontSize: screenSize.width * 0.04,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _currentNumberController,
                        decoration: InputDecoration(
                          hintText: '0',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          filled: true,
                          fillColor: Colors.grey.shade50,
                          suffixText: 'người',
                        ),
                        keyboardType: TextInputType.number,
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                        ],
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Nhập số người';
                          }
                          final number = int.tryParse(value);
                          if (number == null || number < 0) {
                            return 'Số không hợp lệ';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),

            SizedBox(height: screenSize.height * 0.03),

            // Ghi chú
            Container(
              padding: EdgeInsets.all(screenSize.width * 0.04),
              decoration: BoxDecoration(
                color: Colors.orange.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.orange.shade200),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.lightbulb_outline,
                    color: Colors.orange.shade700,
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Lưu ý: Hãy mô tả rõ trình độ và yêu cầu để tìm được người chơi phù hợp nhất!',
                      style: TextStyle(
                        fontSize: screenSize.width * 0.035,
                        color: Colors.orange.shade900,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(height: screenSize.height * 0.04),

            // Nút tạo bài đăng
            Obx(() {
              return ElevatedButton(
                onPressed: controller.isLoading.value
                    ? null
                    : _handleCreatePost,
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(
                    vertical: screenSize.height * 0.02,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: controller.isLoading.value
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : Text(
                        'Đăng bài tuyển người',
                        style: TextStyle(
                          fontSize: screenSize.width * 0.042,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              );
            }),

            SizedBox(height: screenSize.height * 0.02),
          ],
        ),
      ),
    );
  }

  Future<void> _handleCreatePost() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final success = await controller.createPost(
      title: _titleController.text.trim(),
      description: _descriptionController.text.trim(),
      requiredNumber: int.parse(_requiredNumberController.text.trim()),
      currentNumber: int.parse(_currentNumberController.text.trim()),
    );

    if (success) {
      Get.snackbar(
        'Thành công',
        'Đã đăng bài tuyển người chơi thành công!',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.primary,
        colorText: Colors.white,
      );
      final HomeController homeController = Get.find<HomeController>();
      homeController.selectedIndex.value = 2;
      // Quay về trang order history
      Get.offAll(() => HomeScreen());
      
    } else if (controller.errorMessage.value != null) {
      Get.snackbar(
        'Lỗi',
        controller.errorMessage.value!,
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Get.theme.colorScheme.error,
        colorText: Colors.white,
      );
    }
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null) return 'N/A';
    try {
      final date = DateTime.parse(dateStr);
      return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
    } catch (e) {
      return dateStr;
    }
  }

  String _formatTime(String? startTime, String? endTime) {
    if (startTime == null || endTime == null) return 'N/A';
    
    try {
      final start = startTime.split(':');
      final end = endTime.split(':');
      
      return '${start[0]}:${start[1]} - ${end[0]}:${end[1]}';
    } catch (e) {
      return '$startTime - $endTime';
    }
  }
}