import 'package:flutter/material.dart';

class BookingsPage extends StatelessWidget {
  const BookingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final Size screenSize = MediaQuery.of(context).size;
    
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Đơn đặt sân'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Đang chờ'),
              Tab(text: 'Lịch sử'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildBookingList(true, screenSize),
            _buildBookingList(false, screenSize),
          ],
        ),
      ),
    );
  }

  Widget _buildBookingList(bool isPending, Size screenSize) {
    return ListView.builder(
      padding: EdgeInsets.all(screenSize.width * 0.04),
      itemCount: 5,
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
                    Container(
                      width: screenSize.width * 0.15,
                      height: screenSize.width * 0.15,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        image: const DecorationImage(
                          image: AssetImage('assets/images/login_1.webp'),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    SizedBox(width: screenSize.width * 0.03),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Sân bóng đá ${index + 1}',
                            style: TextStyle(
                              fontSize: screenSize.width * 0.045,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: screenSize.height * 0.005),
                          Row(
                            children: [
                              Icon(
                                Icons.location_on,
                                size: screenSize.width * 0.04,
                                color: Colors.grey,
                              ),
                              SizedBox(width: screenSize.width * 0.01),
                              Text(
                                'Đà Nẵng',
                                style: TextStyle(
                                  fontSize: screenSize.width * 0.035,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: screenSize.width * 0.03,
                        vertical: screenSize.height * 0.006,
                      ),
                      decoration: BoxDecoration(
                        color: isPending ? Colors.orange.withOpacity(0.1) : Colors.green.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        isPending ? 'Đang chờ' : 'Hoàn thành',
                        style: TextStyle(
                          color: isPending ? Colors.orange : Colors.green,
                          fontSize: screenSize.width * 0.035,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: screenSize.height * 0.02),
                const Divider(),
                _buildBookingDetail('Ngày:', '19/10/2023', screenSize),
                _buildBookingDetail('Thời gian:', '18:00 - 19:00', screenSize),
                _buildBookingDetail('Số người:', '10 người', screenSize),
                _buildBookingDetail('Tổng tiền:', '200.000đ', screenSize),
                SizedBox(height: screenSize.height * 0.02),
                if (isPending)
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {},
                          style: OutlinedButton.styleFrom(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text('Hủy đơn'),
                        ),
                      ),
                      SizedBox(width: screenSize.width * 0.03),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text('Thanh toán'),
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

  Widget _buildBookingDetail(String label, String value, Size screenSize) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: screenSize.height * 0.006),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: screenSize.width * 0.035,
              color: Colors.grey,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: screenSize.width * 0.035,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}