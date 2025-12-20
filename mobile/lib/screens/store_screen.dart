import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/home_controller.dart';
import 'package:mobile/controller/store_controller.dart';
import 'package:mobile/controller/field_search_controller.dart';
import 'package:mobile/controller/sport_category_controller.dart';
import 'package:mobile/models/Store.dart';
import 'package:mobile/screens/store_detail_screen.dart';
import 'package:mobile/utilities/local_storage.dart';
import 'package:mobile/widgets/field_card.dart';
import 'package:mobile/widgets/loading.dart';
import 'package:mobile/widgets/search_widget.dart';
import 'package:mobile/widgets/sport_category_header.dart';
import 'package:mobile/widgets/sport_category_list.dart';

class StorePage extends StatelessWidget {
  const StorePage({super.key});

  Future<void> _refreshData(StoreController storeController) async {
    final HomeController controller = Get.find<HomeController>();
    await storeController.fetchStores();
    final sportCategoryController = Get.find<SportCategoryController>();
    sportCategoryController.fetchCategoriesFromAPI();
    controller.getUserLocation();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final Size screenSize = MediaQuery.of(context).size;
    final double horizontalPadding = screenSize.width * 0.045;
    final double verticalPadding = screenSize.height * 0.018;

    final storeController = Get.find<StoreController>();
    final searchController = Get.put(FieldSearchController());
    final sportCategoryController = Get.find<SportCategoryController>();
    final homeController = Get.find<HomeController>();

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: Obx(() {
        final hasFilter =
            searchController.searchQuery.value.isNotEmpty ||
            searchController.selectedWard.value != null ||
            searchController.selectedProvince.value != null ||
            sportCategoryController.selectedCategory.value != null;

        return RefreshIndicator(
          onRefresh: () => _refreshData(storeController),
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            slivers: [
              const SliverToBoxAdapter(child: SizedBox()),

              if (hasFilter)
                ..._buildSearchSlivers(
                  context,
                  theme,
                  screenSize,
                  horizontalPadding,
                  verticalPadding,
                  storeController,
                  searchController,
                  sportCategoryController,
                )
              else
                ..._buildDefaultSlivers(
                  context,
                  theme,
                  screenSize,
                  horizontalPadding,
                  verticalPadding,
                  storeController,
                  searchController,
                  sportCategoryController,
                  homeController,
                ),
            ],
          ),
        );
      }),
    );
  }

  // ----------------------------
  // DEFAULT PAGE SLIVERS
  // ----------------------------
  List<Widget> _buildDefaultSlivers(
    BuildContext context,
    ThemeData theme,
    Size screenSize,
    double horizontalPadding,
    double verticalPadding,
    StoreController storeController,
    FieldSearchController searchController,
    SportCategoryController sportCategoryController,
    HomeController homeController,
  ) {
    return [
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
        child: Obx(
          () => Padding(
            padding: EdgeInsets.fromLTRB(
              horizontalPadding,
              verticalPadding,
              horizontalPadding,
              verticalPadding * 0.8,
            ),
            child: Text(
              'Ở trong khu vực ${homeController.locationName.value}',
              style: TextStyle(
                fontSize: screenSize.width * 0.048,
                fontWeight: FontWeight.w700,
                color: theme.colorScheme.onSurface,
              ),
            ),
          ),
        ),
      ),

      SliverPadding(
        padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
        sliver: Obx(() {
          if (storeController.isLoading.value) {
            return SliverToBoxAdapter(child: Center(child: loadingIndicator()));
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
    ];
  }

  // ----------------------------
  // SEARCH PAGE SLIVERS - MỚI VỚI 2 MỤC
  // ----------------------------
  List<Widget> _buildSearchSlivers(
    BuildContext context,
    ThemeData theme,
    Size screenSize,
    double horizontalPadding,
    double verticalPadding,
    StoreController storeController,
    FieldSearchController searchController,
    SportCategoryController sportCategoryController,
  ) {
    return [
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

      // LOADING STATE
      Obx(() {
        if (storeController.isLoading.value) {
          return SliverToBoxAdapter(
            child: Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: verticalPadding * 3),
                child: loadingIndicator(),
              ),
            ),
          );
        }

        // NO RESULTS STATE
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

        // RESULTS WITH 2 SECTIONS
        return SliverToBoxAdapter(child: SizedBox.shrink());
      }),

      // SECTION 1: TRONG THÀNH PHỐ
      Obx(() {
        if (storeController.isLoading.value ||
            storeController.storesInCity.isEmpty) {
          return const SliverToBoxAdapter(child: SizedBox.shrink());
        }

        return SliverToBoxAdapter(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: EdgeInsets.fromLTRB(
                  horizontalPadding,
                  verticalPadding * 1.5,
                  horizontalPadding,
                  verticalPadding * 0.8,
                ),
                child: Row(
                  children: [
                    ShaderMask(
                      shaderCallback: (Rect bounds) {
                        return const LinearGradient(
                          colors: [Colors.green, Colors.blue],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ).createShader(bounds);
                      },
                      child: const Icon(
                        Icons.location_city,
                        size: 24,
                        color: Colors.white, // bắt buộc
                      ),
                    ),
                    const SizedBox(width: 8),

                    Text(
                      'Trong ${storeController.userProvince.value}',
                      style: TextStyle(
                        fontSize: screenSize.width * 0.048,
                        fontWeight: FontWeight.w700,
                        color: theme.colorScheme.onSurface,
                      ),
                    ),
                    Spacer(),
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${storeController.storesInCity.length} sân',
                        style: TextStyle(
                          fontSize: screenSize.width * 0.035,
                          fontWeight: FontWeight.w600,
                          color: theme.colorScheme.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      }),

      // GRID FOR IN-CITY STORES
      SliverPadding(
        padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
        sliver: Obx(() {
          if (storeController.isLoading.value ||
              storeController.storesInCity.isEmpty) {
            return const SliverToBoxAdapter(child: SizedBox.shrink());
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
                storeController.storesInCity[index],
                screenSize,
                storeController,
                sportCategoryController,
                theme,
              ),
              childCount: storeController.storesInCity.length,
            ),
          );
        }),
      ),

      // SECTION 2: NGOÀI THÀNH PHỐ
      Obx(() {
        if (storeController.isLoading.value ||
            storeController.storesOutsideCity.isEmpty) {
          return const SliverToBoxAdapter(child: SizedBox.shrink());
        }

        return SliverToBoxAdapter(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: EdgeInsets.fromLTRB(
                  horizontalPadding,
                  verticalPadding * 2,
                  horizontalPadding,
                  verticalPadding * 0.8,
                ),
                child: Row(
                  children: [
                    ShaderMask(
                      shaderCallback: (Rect bounds) {
                        return const LinearGradient(
                          colors: [Colors.green, Colors.blue],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ).createShader(bounds);
                      },
                      child: const Icon(
                        Icons.public,
                        size: 24,
                        color: Colors.white, // bắt buộc
                      ),
                    ),
                    const SizedBox(width: 8),

                    SizedBox(width: 8),
                    Text(
                      'Ngoài thành phố',
                      style: TextStyle(
                        fontSize: screenSize.width * 0.048,
                        fontWeight: FontWeight.w700,
                        color: theme.colorScheme.onSurface,
                      ),
                    ),
                    Spacer(),
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.secondary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${storeController.storesOutsideCity.length} sân',
                        style: TextStyle(
                          fontSize: screenSize.width * 0.035,
                          fontWeight: FontWeight.w600,
                          color: theme.colorScheme.secondary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      }),

      // GRID FOR OUTSIDE-CITY STORES
      SliverPadding(
        padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
        sliver: Obx(() {
          if (storeController.isLoading.value ||
              storeController.storesOutsideCity.isEmpty) {
            return const SliverToBoxAdapter(child: SizedBox.shrink());
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
                storeController.storesOutsideCity[index],
                screenSize,
                storeController,
                sportCategoryController,
                theme,
              ),
              childCount: storeController.storesOutsideCity.length,
            ),
          );
        }),
      ),

      const SliverToBoxAdapter(child: SizedBox(height: 40)),
    ];
  }

  // ----------------------------
  // HEADER
  // ----------------------------
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

  // ----------------------------
  // GRID ITEM
  // ----------------------------
  Widget _buildSuggestedField(
    Store store,
    Size screenSize,
    StoreController controller,
    SportCategoryController sportController,
    ThemeData theme,
  ) {
    return GestureDetector(
      onTap: () {
        Get.to(
          () => StoreDetailScreen(
            store: store,
            sportCategory: sportController.selectedCategoryId.value ?? 'tất cả',
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
