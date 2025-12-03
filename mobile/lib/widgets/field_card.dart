import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:lottie/lottie.dart';
import 'package:mobile/screens/store_detail_screen.dart';
import 'package:mobile/services/store_service.dart';
import 'package:mobile/widgets/loading.dart';
import 'package:mobile/widgets/store_quick_view.dart';
import 'package:mobile/models/Store.dart';

class FieldCard extends StatelessWidget {
  final dynamic store;
  final ThemeData theme;
  final bool isFeatured;
  final String? sportCategoryId;
  final StoreService _storeDetailService = StoreService();

  FieldCard({
    Key? key,
    required this.store,
    required this.theme,
    this.isFeatured = false,
    this.sportCategoryId,
  }) : super(key: key);

  Future<void> _showQuickView(BuildContext context) async {
    try {
      // Show loading
      Get.dialog(
        Center(
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: theme.scaffoldBackgroundColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: ClipOval(
              child: Lottie.asset(
                'assets/lottie/loading.json',
                height: 85,
                width: 85,
              ),
            ),
          ),
        ),
        barrierDismissible: false,
      );

      // Fetch store detail
      final storeDetail = await _storeDetailService.getStoreDetail(store.id);

      // Close loading
      Get.back();

      // Show bottom sheet with detail
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        backgroundColor: Colors.transparent,
        builder: (context) => Stack(
          children: [
            StoreQuickViewSheet(
              storeDetail: storeDetail,
              sportCategoryId: sportCategoryId,
            ),
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: QuickViewActionBar(
                storeDetail: storeDetail,
                sportCategoryId: sportCategoryId,
              ),
            ),
          ],
        ),
      );
    } catch (e) {
      Get.back(); // Close loading if error
      Get.snackbar(
        'Lỗi',
        'Không thể tải thông tin chi tiết',
        snackPosition: SnackPosition.BOTTOM,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final textScale = MediaQuery.textScaleFactorOf(context);

    return GestureDetector(
      onTap: () {
        Get.to(
          () => StoreDetailScreen(
            store: store,
            sportCategory: sportCategoryId ?? 'tất cả',
          ),
        );
      },
      onLongPress: () => _showQuickView(context),
      child: isFeatured
          ? _buildFeaturedCard(size, textScale)
          : _buildGridCard(size, textScale),
    );
  }

  // ================= FEATURED CARD =================

  Widget _buildFeaturedCard(Size size, double textScale) {
    return Container(
      width: size.width * 0.72,
      margin: EdgeInsets.only(right: size.width * 0.038),
      decoration: _cardShadow(),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: AspectRatio(
          aspectRatio: 16 / 9,
          child: Stack(
            children: [
              _buildImage(),
              _buildGradientOverlay(),
              Positioned(
                top: 12,
                left: 12,
                right: 12,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildViewCountBadge(textScale),
                    _buildRatingBadge(textScale),
                  ],
                ),
              ),
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                child: _buildFeaturedBottomInfo(size, textScale),
              ),

              // Long press hint
            ],
          ),
        ),
      ),
    );
  }

  // ================= GRID CARD =================

  Widget _buildGridCard(Size size, double textScale) {
    return Container(
      decoration: _cardShadow(),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(18),
        child: AspectRatio(
          aspectRatio: 3 / 4,
          child: Column(
            children: [
              Expanded(
                flex: 5,
                child: Stack(
                  children: [
                    _buildImage(),
                    Positioned(
                      top: 10,
                      right: 0,
                      child: _buildRatingBadge(textScale),
                    ),
                    Positioned(
                      top: 10,
                      left: 0,
                      child: _buildViewCountBadge(textScale),
                    ),
                    // Long press hint
                  ],
                ),
              ),
              Expanded(flex: 5, child: _buildGridBottomInfo(size, textScale)),
            ],
          ),
        ),
      ),
    );
  }

  // ================= COMMON UI =================

  BoxDecoration _cardShadow() => BoxDecoration(
    color: theme.colorScheme.surface,
    borderRadius: BorderRadius.circular(18),
    boxShadow: [
      BoxShadow(
        color: theme.brightness == Brightness.dark
            ? Colors.black.withOpacity(0.15)
            : Colors.black.withOpacity(0.1),
        blurRadius: 10,
        offset: const Offset(0, 4),
      ),
    ],
  );

  Widget _buildImage() {
    return Image.network(
      store.avatarUrl ??
          'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Sport_balls.svg/400px-Sport_balls.svg.png',
      width: double.infinity,
      height: double.infinity,
      fit: BoxFit.cover,
      errorBuilder: (_, __, ___) => Container(
        color: theme.colorScheme.surfaceVariant,
        child: Icon(
          Icons.sports_soccer,
          size: 48,
          color: theme.colorScheme.onSurfaceVariant,
        ),
      ),
    );
  }

  Widget _buildGradientOverlay() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.transparent,
            Colors.black.withOpacity(0.2),
            Colors.black.withOpacity(0.7),
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
    );
  }

  Widget _buildViewCountBadge(double textScale) {
    return _badge(
      icon: Icons.remove_red_eye,
      text: "${store.viewCount ?? 0}",
      textScale: textScale,
    );
  }

  Widget _buildRatingBadge(double textScale) {
    return _badge(
      icon: Icons.star,
      iconColor: const Color(0xFFFFB300),
      text: store.averageRating?.toStringAsFixed(1) ?? "5.0",
      textScale: textScale,
    );
  }

  Widget _badge({
    required IconData icon,
    required String text,
    double textScale = 1,
    Color iconColor = Colors.blue,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface.withOpacity(0.9),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(icon, size: 15, color: iconColor),
          const SizedBox(width: 4),
          Text(
            text,
            style: TextStyle(
              fontWeight: FontWeight.w700,
              fontSize: 12 * textScale,
              color: theme.colorScheme.onSurface,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturedBottomInfo(Size size, double textScale) {
    return Padding(
      padding: EdgeInsets.all(size.width * 0.045),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            store.name ?? "",
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 15 * textScale,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(
                Icons.location_on_outlined,
                size: 15,
                color: Colors.white,
              ),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  store.fullAddress ?? "",
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12 * textScale,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          _buildActionButton(),
        ],
      ),
    );
  }

  Widget _buildGridBottomInfo(Size size, double textScale) {
    return Padding(
      padding: EdgeInsets.all(size.width * 0.01),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            store.name ?? "",
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 13 * textScale,
              color: theme.colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              Icon(
                Icons.location_on_outlined,
                size: 10,
                color: theme.colorScheme.onSurface.withOpacity(0.6),
              ),
              const SizedBox(width: 3),
              Expanded(
                child: Text(
                  store.fullAddress ?? "",
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 10 * textScale,
                    color: theme.colorScheme.onSurface.withOpacity(0.6),
                  ),
                ),
              ),
            ],
          ),
          const Spacer(),
          _buildActionButton(),
        ],
      ),
    );
  }

  Widget _buildActionButton() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF00C17C), Colors.green],
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Center(
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Icon(Icons.calendar_today, size: 14, color: Colors.white),
            SizedBox(width: 5),
            Text(
              "Đặt ngay",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class FieldsGrid extends StatelessWidget {
  final List<dynamic> stores;
  final ThemeData theme;
  final String? sportCategoryId;

  const FieldsGrid({
    super.key,
    required this.stores,
    required this.theme,
    this.sportCategoryId,
  });

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;

    int crossAxisCount = width > 1000
        ? 4
        : width > 700
        ? 3
        : 2;

    return SliverGrid(
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        childAspectRatio: 3 / 4,
        crossAxisSpacing: 12,
        mainAxisSpacing: 16,
      ),
      delegate: SliverChildBuilderDelegate((context, index) {
        return FieldCard(
          store: stores[index],
          theme: theme,
          sportCategoryId: sportCategoryId,
          isFeatured: false,
        );
      }, childCount: stores.length),
    );
  }
}

class FeaturedFieldsList extends StatelessWidget {
  final List<dynamic> stores;
  final ThemeData theme;
  final String? sportCategoryId;

  const FeaturedFieldsList({
    Key? key,
    required this.stores,
    required this.theme,
    this.sportCategoryId,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);

    return SizedBox(
      height: size.height * 0.28,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.symmetric(horizontal: size.width * 0.04),
        itemCount: stores.length,
        separatorBuilder: (_, __) => SizedBox(width: size.width * 0.038),
        itemBuilder: (context, index) {
          return SizedBox(
            width: size.width * 0.72,
            child: FieldCard(
              store: stores[index],
              theme: theme,
              isFeatured: true,
              sportCategoryId: sportCategoryId,
            ),
          );
        },
      ),
    );
  }
}
