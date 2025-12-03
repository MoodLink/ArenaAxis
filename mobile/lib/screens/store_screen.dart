import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/store_controller.dart';
import 'package:mobile/controller/field_search_controller.dart';
import 'package:mobile/controller/sport_category_controller.dart';
import 'package:mobile/screens/store_detail_screen.dart';
import 'package:mobile/utilities/local_storage.dart';
import 'package:mobile/widgets/field_card.dart';
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
    final sportCategoryController = Get.find<SportCategoryController>();

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: Obx(() {
        // Kiểm tra xem có filter nào không
        final hasFilter =
            searchController.searchQuery.value.isNotEmpty ||
            searchController.selectedWard.value != null ||
            searchController.selectedProvince.value != null ||
            sportCategoryController.selectedCategory.value != null;

        // Nếu có filter, hiển thị search view
        if (hasFilter) {
          return _buildSearchResultView(
            context,
            theme,
            screenSize,
            horizontalPadding,
            verticalPadding,
            storeController,
            searchController,
            sportCategoryController,
          );
        }

        // Nếu không có filter, hiển thị view mặc định
        return _buildDefaultView(
          context,
          theme,
          screenSize,
          horizontalPadding,
          verticalPadding,
          storeController,
          searchController,
          sportCategoryController,
        );
      }),
    );
  }

  /// View mặc định - hiển thị sân nearby
  Widget _buildDefaultView(
    BuildContext context,
    ThemeData theme,
    Size screenSize,
    double horizontalPadding,
    double verticalPadding,
    StoreController storeController,
    FieldSearchController searchController,
    SportCategoryController sportCategoryController,
  ) {
    return CustomScrollView(
      slivers: [
        _buildHeader(
          screenSize,
          horizontalPadding,
          storeController,
          theme,
          screenSize.height * 0.25,
        ),
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
                      'Các trung tâm thể thao mới',
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
                    if (storeController.stores.isEmpty) {
                      return Center(
                        child: Text(
                          'Không có sân nào',
                          style: TextStyle(
                            color: theme.colorScheme.onSurface.withOpacity(0.6),
                          ),
                        ),
                      );
                    }
                    return FeaturedFieldsList(
                      stores: storeController.stores,
                      theme: theme,
                      sportCategoryId:
                          sportCategoryController.selectedCategoryId.value,
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
              final locationName = snapshot.data ?? '';
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
            if (storeController.stores.isEmpty) {
              return SliverToBoxAdapter(
                child: Padding(
                  padding: EdgeInsets.all(verticalPadding * 2),
                  child: Center(
                    child: Text(
                      'Không tìm thấy sân nào',
                      style: TextStyle(
                        color: theme.colorScheme.onSurface.withOpacity(0.6),
                      ),
                    ),
                  ),
                ),
              );
            }
            return FieldsGrid(
              stores: storeController.stores,
              theme: theme,
              sportCategoryId: sportCategoryController.selectedCategoryId.value,
            );
          }),
        ),
        const SliverToBoxAdapter(child: SizedBox(height: 40)),
      ],
    );
  }

  /// View tìm kiếm - chỉ hiển thị kết quả lọc
  Widget _buildSearchResultView(
    BuildContext context,
    ThemeData theme,
    Size screenSize,
    double horizontalPadding,
    double verticalPadding,
    StoreController storeController,
    FieldSearchController searchController,
    SportCategoryController sportCategoryController,
  ) {
    return CustomScrollView(
      slivers: [
        _buildHeader(
          screenSize,
          horizontalPadding,
          storeController,
          theme,
          screenSize.height * 0.32,
        ),
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
        // Hiển thị active filters

        // Hiển thị kết quả tìm kiếm
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.only(
              left: horizontalPadding,
              right: horizontalPadding,
              top: verticalPadding,
              bottom: verticalPadding * 0.5,
            ),
            child: Obx(() {
              final resultCount = storeController.stores.length;
              return Text(
                'Kết quả tìm kiếm ($resultCount)',
                style: TextStyle(
                  fontSize: screenSize.width * 0.048,
                  fontWeight: FontWeight.w700,
                  color: theme.colorScheme.onSurface,
                ),
              );
            }),
          ),
        ),
        // Grid kết quả
        SliverPadding(
          padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
          sliver: Obx(() {
            if (storeController.isLoading.value) {
              return SliverToBoxAdapter(
                child: Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(
                      vertical: verticalPadding * 3,
                    ),
                    child: loadingIndicator(),
                  ),
                ),
              );
            }

            if (storeController.stores.isEmpty) {
              return SliverToBoxAdapter(
                child: Padding(
                  padding: EdgeInsets.all(verticalPadding * 3),
                  child: Center(
                    child: Column(
                      children: [
                        Icon(
                          Icons.search_off,
                          size: 48,
                          color: theme.colorScheme.onSurface.withOpacity(0.4),
                        ),
                        SizedBox(height: verticalPadding),
                        Text(
                          'Không tìm thấy sân nào',
                          style: TextStyle(
                            fontSize: screenSize.width * 0.04,
                            color: theme.colorScheme.onSurface.withOpacity(0.6),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: verticalPadding * 0.5),
                        Text(
                          'Hãy thử thay đổi các bộ lọc',
                          style: TextStyle(
                            fontSize: screenSize.width * 0.035,
                            color: theme.colorScheme.onSurface.withOpacity(0.5),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
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
                  sportCategoryController,
                  theme,
                ),
                childCount: storeController.stores.length,
              ),
            );
          }),
        ),
        const SliverToBoxAdapter(child: SizedBox(height: 40)),
      ],
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
              colors: [Color(0xFF1976D2), Color(0xFF2196F3), Color(0xFF00C17C)],
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
                  FieldSearchWidget(theme: theme, screenSize: screenSize),
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
                store.avatarUrl ??
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Sport_balls.svg/400px-Sport_balls.svg.png',
                width: double.infinity,
                height: double.infinity,
                fit: BoxFit.cover,
              ),
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
                              store.fullAddress,
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
    StoreController _StoreController,
    SportCategoryController _SportController,
    ThemeData theme,
  ) {
    final store = _StoreController.stores[index];

    return GestureDetector(
      onTap: () {
        Get.to(
          () => StoreDetailScreen(
            store: store,
            sportCategory:
                _SportController.selectedCategoryId.value ?? 'tất cả',
          ),
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
                child: Image.network(
                  store.avatarUrl ??
                      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Sport_balls.svg/400px-Sport_balls.svg.png',
                  width: double.infinity,
                  height: double.infinity,
                  fit: BoxFit.cover,
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
                        Expanded(
                          child: Text(
                            store.fullAddress,
                            style: TextStyle(
                              fontSize: screenSize.width * 0.03,
                              color: theme.colorScheme.onSurface.withOpacity(
                                0.7,
                              ),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
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
                                const Color(0xFF00C17C),
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
                              fontSize: 12,
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
