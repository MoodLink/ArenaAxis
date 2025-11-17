import 'package:flutter/material.dart';
import 'package:mobile/screens/chat_screen.dart';

class TeamMatchPage extends StatelessWidget {
  const TeamMatchPage({super.key});

  @override
  Widget build(BuildContext context) {
    final Size screenSize = MediaQuery.of(context).size;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ghép đội'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView.builder(
        padding: EdgeInsets.all(screenSize.width * 0.04),
        itemCount: 10,
        itemBuilder: (context, index) {
          return Card(
            margin: EdgeInsets.only(bottom: screenSize.height * 0.02),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: EdgeInsets.all(screenSize.width * 0.04),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: screenSize.width * 0.06,
                        backgroundImage:  Image.asset(
                          'assets/images/login_1.webp',
                        ).image,
                      ),
                      SizedBox(width: screenSize.width * 0.03),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Nguyễn Văn A',
                              style: TextStyle(
                                fontSize: screenSize.width * 0.04,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              '10 phút trước',
                              style: TextStyle(
                                fontSize: screenSize.width * 0.035,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.more_vert),
                        onPressed: () {},
                      ),
                    ],
                  ),
                  SizedBox(height: screenSize.height * 0.02),
                  Text(
                    'Cần tìm 3 người đá bóng tại sân ABC vào tối nay. Yêu cầu có kinh nghiệm chơi bóng.',
                    style: TextStyle(fontSize: screenSize.width * 0.04),
                  ),
                  SizedBox(height: screenSize.height * 0.02),
                  Wrap(
                    spacing: screenSize.width * 0.02,
                    runSpacing: screenSize.height * 0.01,
                    children: [
                      _buildChip('19/10/2023', Icons.calendar_today, screenSize),
                      _buildChip('18:00', Icons.access_time, screenSize),
                      _buildChip('3 slot', Icons.people, screenSize),
                      _buildChip('200k/người', Icons.attach_money, screenSize),
                    ],
                  ),
                  SizedBox(height: screenSize.height * 0.02),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.chat_bubble_outline),
                          label: const Text('Chat'),
                          style: OutlinedButton.styleFrom(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ),
                      SizedBox(width: screenSize.width * 0.03),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                           // Use Navigator and pass required params to ChatScreen
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => ChatScreen(
                                  conversationId: 'team_post_$index',
                                  conversationTitle: 'Bài đăng #${index + 1}',
                                ),
                              ),
                            );
                          },
                          icon: const Icon(Icons.group_add),
                          label: const Text('Tham gia'),
                          style: ElevatedButton.styleFrom(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        icon: const Icon(Icons.add),
        label: const Text('Tạo bài đăng'),
      ),
    );
  }

  Widget _buildChip(String label, IconData icon, Size screenSize) {
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: screenSize.width * 0.03,
        vertical: screenSize.height * 0.006,
      ),
      decoration: BoxDecoration(
        color: Colors.grey.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: screenSize.width * 0.04,
            color: Colors.blue,
          ),
          SizedBox(width: screenSize.width * 0.01),
          Text(
            label,
            style: TextStyle(
              fontSize: screenSize.width * 0.035,
            ),
          ),
        ],
      ),
    );
  }
}