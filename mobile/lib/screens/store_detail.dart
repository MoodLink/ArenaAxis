import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/FieldPrincing.dart';
import 'package:mobile/models/field.dart';

import 'package:table_calendar/table_calendar.dart';

class StoreBookingScreen extends StatefulWidget {
  final List<Field> fields;
  const StoreBookingScreen({Key? key, required this.fields}) : super(key: key);

  @override
  State<StoreBookingScreen> createState() => _StoreBookingScreenState();
}

class _StoreBookingScreenState extends State<StoreBookingScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  DateTime _selectedDay = DateTime.now();
  DateTime _focusedDay = DateTime.now();

  // Lưu trữ các khung giờ đã chọn: {fieldId: {date: [pricingId]}}
  Map<String, Map<String, List<int>>> selectedSlots = {};

  final Map<String, Color> fieldColors = {
    '1': const Color(0xFF2196F3),
    '2': const Color(0xFF4CAF50),
    '3': const Color(0xFFFF9800),
    '4': const Color(0xFFE91E63),
  };

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: widget.fields.length, vsync: this);
  }

  String _formatDate(DateTime date) {
    return DateFormat('dd/MM/yyyy').format(date);
  }

  String _formatDay(DateTime date) {
    return DateFormat('EEEE', 'vi_VN').format(date);
  }

  double _getPriceForDay(FieldPricing pricing, DateTime date) {
    final weekday = date.weekday;
    return pricing.dayOfWeek == weekday ? pricing.price : pricing.price * 1.2;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) => [
          SliverAppBar(
            expandedHeight: 380,
            floating: false,
            pinned: true,
            elevation: 0,
            backgroundColor: Colors.white,
            automaticallyImplyLeading: false,
            flexibleSpace: FlexibleSpaceBar(
              collapseMode: CollapseMode.parallax,
              titlePadding: EdgeInsets.zero,
              title: AnimatedOpacity(
                duration: const Duration(milliseconds: 300),
                opacity: innerBoxIsScrolled ? 1.0 : 0.0,
                child: Container(
                  color: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  child: Row(
                    children: [
                      Text(
                        "${_formatDay(_selectedDay)} • ${_formatDate(_selectedDay)}",
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: Colors.black87,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              background: SafeArea(
                child: Column(
                  children: [
                    const SizedBox(height: kToolbarHeight + 20),

                    // 1. Tab sân
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 16),
                      height: 56,
                      decoration: BoxDecoration(
                        color: Colors.grey[100],
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: TabBar(
                        controller: _tabController,
                        isScrollable: true,
                        labelColor: Colors.white,
                        unselectedLabelColor: Colors.grey[600],
                        indicator: BoxDecoration(
                          borderRadius: BorderRadius.circular(30),
                          color: fieldColors[widget.fields[_tabController.index].id] ?? Colors.blue,
                        ),
                        tabs: widget.fields.map((f) {
                          final count = selectedSlots[f.id]?[_formatDate(_selectedDay)]?.length ?? 0;
                          return Tab(
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text("Sân ${f.id}", style: const TextStyle(fontWeight: FontWeight.w600)),
                                if (count > 0) ...[
                                  const SizedBox(width: 8),
                                  CircleAvatar(
                                    radius: 11,
                                    backgroundColor: Colors.white,
                                    child: Text(count.toString(),
                                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                  ),
                                ],
                              ],
                            ),
                          );
                        }).toList(),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // 2. Calendar
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.08),
                            blurRadius: 20,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: TableCalendar(
                        locale: 'vi_VN',
                        firstDay: DateTime.now(),
                        lastDay: DateTime.now().add(const Duration(days: 60)),
                        focusedDay: _focusedDay,
                        selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
                        onDaySelected: (selectedDay, focusedDay) {
                          setState(() {
                            _selectedDay = selectedDay;
                            _focusedDay = focusedDay;
                          });
                        },
                        headerStyle: const HeaderStyle(
                          formatButtonVisible: false,
                          titleCentered: true,
                          titleTextStyle: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                        ),
                        calendarStyle: CalendarStyle(
                          selectedDecoration: BoxDecoration(
                            color: fieldColors[widget.fields[_tabController.index].id] ?? Colors.blue,
                            shape: BoxShape.circle,
                          ),
                          todayDecoration: BoxDecoration(
                            color: (fieldColors[widget.fields[_tabController.index].id] ?? Colors.blue).withOpacity(0.3),
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
        body: TabBarView(
          controller: _tabController,
          children: widget.fields.map((field) => _buildTimeSlotsFullScreen(field)).toList(),
        ),
      ),
      bottomNavigationBar: _buildBottomBar(),
    );
  }

  Widget _buildTimeSlotsFullScreen(Field field) {
    return Container(
      color: Colors.grey[50],
      child: _buildTimeSlots(field),
    );
  }

  Widget _buildTimeSlots(Field field) {
    final dateKey = _formatDate(_selectedDay);
    final selectedIds = selectedSlots[field.id]?[dateKey] ?? [];

    // Khung giờ từ 5h - 22h, mỗi khung 1.5h
    final timeSlots = <Map<String, dynamic>>[];
    for (int hour = 5; hour < 22; hour += 1) {
      final start = DateTime(_selectedDay.year, _selectedDay.month, _selectedDay.day, hour);
      final end = start.add(const Duration(hours: 1, minutes: 30));
      final pricing = field.prices.firstWhere(
        (p) => p.dayOfWeek == _selectedDay.weekday,
        orElse: () => field.prices[0],
      );

      final price = _getPriceForDay(pricing, _selectedDay);

      timeSlots.add({
        'start': DateFormat('HH:mm').format(start),
        'end': DateFormat('HH:mm').format(end),
        'price': price,
        'pricingId': pricing.id,
      });
    }

    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 1.8,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: timeSlots.length,
      itemBuilder: (context, index) {
        final slot = timeSlots[index];
        final isSelected = selectedIds.contains(slot['pricingId']);

        return GestureDetector(
          onTap: () {
            setState(() {
              if (!selectedSlots.containsKey(field.id)) {
                selectedSlots[field.id] = {};
              }
              if (!selectedSlots[field.id]!.containsKey(dateKey)) {
                selectedSlots[field.id]![dateKey] = [];
              }

              final list = selectedSlots[field.id]![dateKey]!;
              if (isSelected) {
                list.remove(slot['pricingId']);
              } else {
                list.add(slot['pricingId']);
              }
            });
          },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            decoration: BoxDecoration(
              color: isSelected
                  ? (fieldColors[field.id] ?? Colors.blue).withOpacity(0.15)
                  : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isSelected
                    ? (fieldColors[field.id] ?? Colors.blue)
                    : Colors.grey[300]!,
                width: isSelected ? 2 : 1.5,
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  "${slot['start']} - ${slot['end']}",
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 13,
                    color: isSelected ? fieldColors[field.id] ?? Colors.blue : Colors.black87,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  "${(slot['price'] / 1000).toStringAsFixed(0)}k",
                  style: TextStyle(
                    fontSize: 12,
                    color: isSelected ? fieldColors[field.id] ?? Colors.blue : Colors.grey[700],
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (isSelected)
                  const Icon(Icons.check_circle, size: 16, color: Colors.green),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildBottomBar() {
    int totalSlots = 0;
    double totalPrice = 0;

    selectedSlots.forEach((fieldId, dates) {
      dates.forEach((date, pricingIds) {
        totalSlots += pricingIds.length;
        totalPrice += pricingIds.length * 200000;
      });
    });

    if (totalSlots == 0) {
      return const SizedBox(height: 0);
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
          ),
        ],
      ),
      child: Row(
        children: [
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "$totalSlots khung giờ",
                style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
              ),
              Text(
                "Tổng ${NumberFormat.currency(locale: 'vi', symbol: 'đ').format(totalPrice)}",
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF2196F3),
                ),
              ),
            ],
          ),
          const Spacer(),
          ElevatedButton(
            onPressed: () {
              Get.snackbar(
                "Đặt sân thành công!",
                "Bạn đã đặt $totalSlots khung giờ với tổng $totalPrice",
                backgroundColor: Colors.green,
                colorText: Colors.white,
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF2196F3),
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            child: const Text(
              "Xác nhận đặt sân",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }
}