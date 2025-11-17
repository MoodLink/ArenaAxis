import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/store_controller.dart';
import 'package:mobile/controller/field_search_controller.dart';
import 'package:mobile/models/field.dart';
import 'package:mobile/models/FieldPrincing.dart';
import 'package:mobile/screens/store_detail.dart';
import 'package:mobile/utilities/local_storage.dart';
import 'package:mobile/widgets/loading.dart';
import 'package:mobile/widgets/search_widget.dart';
import 'package:mobile/widgets/sport_category_header.dart';
import 'package:mobile/widgets/sport_category_list.dart';

class StorePage extends StatelessWidget {
  const StorePage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final Size screenSize = MediaQuery.of(context).size;
    final double horizontalPadding = screenSize.width * 0.045;
    final double verticalPadding = screenSize.height * 0.018;

    final storeController = Get.find<StoreController>();
    final searchController = Get.put(FieldSearchController());

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: CustomScrollView(
        slivers: [
          Obx(() {
            // Kiểm tra xem có search query không
            final hasSearchQuery = searchController.searchQuery.value.isNotEmpty;
            
            // Tính toán height động
            final expandedHeight = hasSearchQuery 
                ? screenSize.height * 0.30
                : screenSize.height * 0.25;

            return _buildHeader(
              screenSize,
              horizontalPadding,
              storeController,
              theme,
              expandedHeight,
            );
          }),

          SliverToBoxAdapter(
            child: Container(
              padding: EdgeInsets.symmetric(vertical: verticalPadding * 0.8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SportCategoryHeader(
                    horizontalPadding: horizontalPadding,
                    screenSize: screenSize,
                  ),
                  SizedBox(height: verticalPadding * 0.5),
                  SizedBox(
                    height: screenSize.height * 0.12,
                    child: SportCategoryList(screenSize: screenSize),
                  ),
                ],
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.only(
                left: horizontalPadding,
                right: horizontalPadding,
                bottom: verticalPadding,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Các sân mới',
                        style: TextStyle(
                          fontSize: screenSize.width * 0.048,
                          fontWeight: FontWeight.w700,
                          color: theme.colorScheme.onSurface,
                        ),
                      ),
                      TextButton(
                        onPressed: () {},
                        child: Text(
                          'Xem thêm',
                          style: TextStyle(
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: verticalPadding * 0.8),
                  SizedBox(
                    height: screenSize.height * 0.27,
                    child: Obx(() {
                      if (storeController.isLoading.value) {
                        return loadingIndicator();
                      }
                      return ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: storeController.stores.length,
                        itemBuilder: (context, index) => _buildFeaturedField(
                          index,
                          screenSize,
                          storeController,
                          theme,
                        ),
                      );
                    }),
                  ),
                ],
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: FutureBuilder<String?>(
              future: LocalStorageHelper.getSavedLocation(),
              builder: (context, snapshot) {
                final locationName = snapshot.data ?? 'khu vực của bạn';
                return Padding(
                  padding: EdgeInsets.fromLTRB(
                    horizontalPadding,
                    verticalPadding,
                    horizontalPadding,
                    verticalPadding * 0.8,
                  ),
                  child: Text(
                    'Ở trong khu vực $locationName',
                    style: TextStyle(
                      fontSize: screenSize.width * 0.048,
                      fontWeight: FontWeight.w700,
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
                );
              },
            ),
          ),

          SliverPadding(
            padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
            sliver: Obx(() {
              if (storeController.isLoading.value) {
                return SliverToBoxAdapter(
                  child: Center(child: loadingIndicator()),
                );
              }
              return SliverGrid(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: screenSize.width > 600 ? 3 : 2,
                  childAspectRatio: 0.72,
                  crossAxisSpacing: horizontalPadding * 0.8,
                  mainAxisSpacing: verticalPadding * 1.2,
                ),
                delegate: SliverChildBuilderDelegate(
                  (context, index) => _buildSuggestedField(
                    index,
                    screenSize,
                    storeController,
                    theme,
                  ),
                  childCount: storeController.stores.length,
                ),
              );
            }),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 40)),
        ],
      ),
    );
  }

  Widget _buildHeader(
    Size screenSize,
    double horizontalPadding,
    StoreController controller,
    ThemeData theme,
    double expandedHeight,
  ) {
    return SliverAppBar(
      expandedHeight: expandedHeight,
      floating: true,
      pinned: true,
      elevation: 0,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF1976D2), Color(0xFF2196F3), Color(0xFF42A5F5)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: SafeArea(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Chào bạn! 👋',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.9),
                      fontSize: screenSize.width * 0.06,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Tìm sân để chơi thôi',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: screenSize.width * 0.065,
                      fontWeight: FontWeight.w700,
                      letterSpacing: -0.5,
                    ),
                  ),
                  FieldSearchWidget(theme: theme, screenSize: screenSize)
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFeaturedField(
    int index,
    Size screenSize,
    StoreController controller,
    ThemeData theme,
  ) {
    final store = controller.stores[index];

    return GestureDetector(
      child: Container(
        width: screenSize.width * 0.72,
        margin: EdgeInsets.only(right: screenSize.width * 0.038),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: theme.brightness == Brightness.dark
                  ? Colors.black.withOpacity(0.3)
                  : Colors.black.withOpacity(0.15),
              blurRadius: 15,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Stack(
            children: [
              Image.network(
                store.avatarUrl ?? 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Sport_balls.svg/400px-Sport_balls.svg.png' ,
                width: double.infinity,
                height: double.infinity,
                fit: BoxFit.cover,
              ),

              // Gradient overlay
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.3),
                      Colors.black.withOpacity(0.8),
                    ],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    stops: const [0.4, 0.7, 1.0],
                  ),
                ),
              ),

              // Lượt xem
              Positioned(
                top: 14,
                left: 14,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surface.withOpacity(0.95),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.remove_red_eye,
                        color: theme.colorScheme.primary,
                        size: 18,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        "${store.viewCount}",
                        style: TextStyle(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.w800,
                          fontSize: screenSize.width * 0.037,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Rating
              Positioned(
                top: 14,
                right: 14,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surface.withOpacity(0.95),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.star,
                        color: Color(0xFFFFB300),
                        size: 16,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        store.averageRating?.toStringAsFixed(1) ?? '4.5',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 13,
                          color: theme.colorScheme.onSurface,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Padding(
                  padding: EdgeInsets.all(screenSize.width * 0.042),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        store.name,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: screenSize.width * 0.048,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(
                            Icons.location_on_outlined,
                            color: Colors.white,
                            size: 16,
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              store.ward.toString(),
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.95),
                                fontSize: screenSize.width * 0.035,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSuggestedField(
    int index,
    Size screenSize,
    StoreController controller,
    ThemeData theme,
  ) {
    final store = controller.stores[index];

    return GestureDetector(
      onTap: () {
        Get.to(
          () => StoreBookingScreen(fields: BookingMockData.getFakeFields()),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          color: theme.colorScheme.surface,
          boxShadow: [
            BoxShadow(
              color: theme.brightness == Brightness.dark
                  ? Colors.black.withOpacity(0.15)
                  : Colors.black.withOpacity(0.06),
              blurRadius: 12,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 3,
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(18),
                ),
                child: Image.asset(
                  'assets/images/login_1.webp',
                  fit: BoxFit.cover,
                  width: double.infinity,
                ),
              ),
            ),

            Expanded(
              flex: 3,
              child: Padding(
                padding: EdgeInsets.all(screenSize.width * 0.02),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      store.name,
                      style: TextStyle(
                        fontSize: screenSize.width * 0.038,
                        fontWeight: FontWeight.w700,
                        color: theme.colorScheme.onSurface,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),

                    Row(
                      children: [
                        Icon(
                          Icons.location_on_outlined,
                          size: 13,
                          color: theme.colorScheme.onSurface,
                        ),
                        const SizedBox(width: 3),
                        Text(
                          store.ward.toString(),
                          style: TextStyle(
                            fontSize: screenSize.width * 0.03,
                            color: theme.colorScheme.onSurface.withOpacity(0.7),
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),

                    const Spacer(),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.remove_red_eye,
                              color: theme.colorScheme.primary,
                              size: 18,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              "${store.viewCount}",
                              style: TextStyle(
                                color: theme.colorScheme.primary,
                                fontWeight: FontWeight.w800,
                                fontSize: screenSize.width * 0.037,
                              ),
                            ),
                          ],
                        ),

                        Container(
                          padding: EdgeInsets.symmetric(
                            horizontal: screenSize.width * 0.024,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                theme.colorScheme.primary,
                                theme.colorScheme.primary.withOpacity(0.8),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Text(
                            'Đặt ngay',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class BookingMockData {
  static List<Field> getFakeFields() {
    return [
      Field(
        id: '1',
        name: 'Sân 1 - Cỏ nhân tạo',
        description: 'Sân bóng cỏ nhân tạo chất lượng cao, ánh sáng tốt',
        storeId: 'store_001',
        sportId: 'sport_001',
        status: 'active',
        images: ['https://via.placeholder.com/400x300?text=San+1'],
        prices: [
          FieldPricing(
            id: 1,
            fieldId: 1,
            dayOfWeek: 1,
            startAt: '05:00',
            endAt: '06:30',
            price: 200000,
          ),
          FieldPricing(
            id: 2,
            fieldId: 1,
            dayOfWeek: 2,
            startAt: '05:00',
            endAt: '06:30',
            price: 200000,
          ),
          FieldPricing(
            id: 3,
            fieldId: 1,
            dayOfWeek: 3,
            startAt: '05:00',
            endAt: '06:30',
            price: 200000,
          ),
          FieldPricing(
            id: 4,
            fieldId: 1,
            dayOfWeek: 4,
            startAt: '05:00',
            endAt: '06:30',
            price: 200000,
          ),
          FieldPricing(
            id: 5,
            fieldId: 1,
            dayOfWeek: 5,
            startAt: '05:00',
            endAt: '06:30',
            price: 250000,
          ),
          FieldPricing(
            id: 6,
            fieldId: 1,
            dayOfWeek: 6,
            startAt: '05:00',
            endAt: '06:30',
            price: 300000,
          ),
          FieldPricing(
            id: 7,
            fieldId: 1,
            dayOfWeek: 0,
            startAt: '05:00',
            endAt: '06:30',
            price: 300000,
          ),
        ],
      ),
      Field(
        id: '2',
        name: 'Sân 2 - Sân mới',
        description: 'Sân bóng mới, hiện đại, tiện nghi đầy đủ',
        storeId: 'store_001',
        sportId: 'sport_001',
        status: 'active',
        images: ['https://via.placeholder.com/400x300?text=San+2'],
        prices: [
          FieldPricing(
            id: 8,
            fieldId: 2,
            dayOfWeek: 1,
            startAt: '05:00',
            endAt: '06:30',
            price: 220000,
          ),
          FieldPricing(
            id: 9,
            fieldId: 2,
            dayOfWeek: 2,
            startAt: '05:00',
            endAt: '06:30',
            price: 220000,
          ),
          FieldPricing(
            id: 10,
            fieldId: 2,
            dayOfWeek: 3,
            startAt: '05:00',
            endAt: '06:30',
            price: 220000,
          ),
          FieldPricing(
            id: 11,
            fieldId: 2,
            dayOfWeek: 4,
            startAt: '05:00',
            endAt: '06:30',
            price: 220000,
          ),
          FieldPricing(
            id: 12,
            fieldId: 2,
            dayOfWeek: 5,
            startAt: '05:00',
            endAt: '06:30',
            price: 270000,
          ),
          FieldPricing(
            id: 13,
            fieldId: 2,
            dayOfWeek: 6,
            startAt: '05:00',
            endAt: '06:30',
            price: 320000,
          ),
          FieldPricing(
            id: 14,
            fieldId: 2,
            dayOfWeek: 0,
            startAt: '05:00',
            endAt: '06:30',
            price: 320000,
          ),
        ],
      ),
      Field(
        id: '3',
        name: 'Sân 3 - Sân tiêu chuẩn',
        description: 'Sân bóng tiêu chuẩn, giá hợp lý, phù hợp cho đa số',
        storeId: 'store_001',
        sportId: 'sport_001',
        status: 'active',
        images: ['https://via.placeholder.com/400x300?text=San+3'],
        prices: [
          FieldPricing(
            id: 15,
            fieldId: 3,
            dayOfWeek: 1,
            startAt: '05:00',
            endAt: '06:30',
            price: 180000,
          ),
          FieldPricing(
            id: 16,
            fieldId: 3,
            dayOfWeek: 2,
            startAt: '05:00',
            endAt: '06:30',
            price: 180000,
          ),
          FieldPricing(
            id: 17,
            fieldId: 3,
            dayOfWeek: 3,
            startAt: '05:00',
            endAt: '06:30',
            price: 180000,
          ),
          FieldPricing(
            id: 18,
            fieldId: 3,
            dayOfWeek: 4,
            startAt: '05:00',
            endAt: '06:30',
            price: 180000,
          ),
          FieldPricing(
            id: 19,
            fieldId: 3,
            dayOfWeek: 5,
            startAt: '05:00',
            endAt: '06:30',
            price: 230000,
          ),
          FieldPricing(
            id: 20,
            fieldId: 3,
            dayOfWeek: 6,
            startAt: '05:00',
            endAt: '06:30',
            price: 280000,
          ),
          FieldPricing(
            id: 21,
            fieldId: 3,
            dayOfWeek: 0,
            startAt: '05:00',
            endAt: '06:30',
            price: 280000,
          ),
        ],
      ),
      Field(
        id: '4',
        name: 'Sân 4 - Sân VIP',
        description: 'Sân VIP với tiện nghi tốt nhất, dịch vụ 5 sao',
        storeId: 'store_001',
        sportId: 'sport_001',
        status: 'active',
        images: ['https://via.placeholder.com/400x300?text=San+VIP'],
        prices: [
          FieldPricing(
            id: 22,
            fieldId: 4,
            dayOfWeek: 1,
            startAt: '05:00',
            endAt: '06:30',
            price: 350000,
          ),
          FieldPricing(
            id: 23,
            fieldId: 4,
            dayOfWeek: 2,
            startAt: '05:00',
            endAt: '06:30',
            price: 350000,
          ),
          FieldPricing(
            id: 24,
            fieldId: 4,
            dayOfWeek: 3,
            startAt: '05:00',
            endAt: '06:30',
            price: 350000,
          ),
          FieldPricing(
            id: 25,
            fieldId: 4,
            dayOfWeek: 4,
            startAt: '05:00',
            endAt: '06:30',
            price: 350000,
          ),
          FieldPricing(
            id: 26,
            fieldId: 4,
            dayOfWeek: 5,
            startAt: '05:00',
            endAt: '06:30',
            price: 400000,
          ),
          FieldPricing(
            id: 27,
            fieldId: 4,
            dayOfWeek: 6,
            startAt: '05:00',
            endAt: '06:30',
            price: 450000,
          ),
          FieldPricing(
            id: 28,
            fieldId: 4,
            dayOfWeek: 0,
            startAt: '05:00',
            endAt: '06:30',
            price: 450000,
          ),
        ],
      ),
    ];
  }
}