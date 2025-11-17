import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/store_controller.dart';
import 'package:mobile/models/field.dart';
import 'package:mobile/screens/store_detail.dart';
import 'package:mobile/screens/store_page.dart';
import 'package:mobile/widgets/loading.dart';

class SearchResultsPage extends StatelessWidget {
  final String searchQuery;
  final String? provinceFilter;
  final String? wardFilter;

  const SearchResultsPage({
    super.key,
    required this.searchQuery,
    this.provinceFilter,
    this.wardFilter,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final Size screenSize = MediaQuery.of(context).size;
    final double horizontalPadding = screenSize.width * 0.045;
    final double verticalPadding = screenSize.height * 0.018;

    final storeController = Get.find<StoreController>();

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: theme.appBarTheme.backgroundColor,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios,
            color: theme.colorScheme.onSurface,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Kết quả tìm kiếm',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: theme.colorScheme.onSurface,
              ),
            ),
            Text(
              searchQuery,
              style: TextStyle(
                fontSize: 12,
                color: theme.colorScheme.onSurface.withOpacity(0.7),
                fontWeight: FontWeight.w400,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          // Filter Info
          if (provinceFilter != null || wardFilter != null)
            Container(
              padding: EdgeInsets.symmetric(
                horizontal: horizontalPadding,
                vertical: verticalPadding * 0.8,
              ),
              child: Wrap(
                spacing: 8,
                children: [
                  if (provinceFilter != null)
                    _buildFilterTag(
                      label: provinceFilter!,
                      icon: Icons.map,
                      theme: theme,
                    ),
                  if (wardFilter != null)
                    _buildFilterTag(
                      label: wardFilter!,
                      icon: Icons.location_on,
                      theme: theme,
                    ),
                ],
              ),
            ),

          // Search Results
          Expanded(
            child: Obx(() {
              if (storeController.isLoading.value) {
                return Center(child: loadingIndicator());
              }

              // Filter stores based on search query and location
              final filteredStores = storeController.stores
                  .where((store) {
                    final matchesSearch =
                        store.name.toLowerCase().contains(
                              searchQuery.toLowerCase(),
                            ) ||
                            store.ward.toString().toLowerCase().contains(
                                  searchQuery.toLowerCase(),
                                );

                    final matchesProvince = provinceFilter == null ||
                        store.province.toString() == provinceFilter;

                    final matchesWard = wardFilter == null ||
                        store.ward.toString() == wardFilter;

                    return matchesSearch &&
                        matchesProvince &&
                        matchesWard;
                  })
                  .toList();

              if (filteredStores.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.search_off_rounded,
                        size: 64,
                        color: theme.colorScheme.onSurface.withOpacity(0.3),
                      ),
                      SizedBox(height: verticalPadding * 2),
                      Text(
                        'Không tìm thấy sân',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: theme.colorScheme.onSurface,
                        ),
                      ),
                      SizedBox(height: verticalPadding),
                      Text(
                        'Thử thay đổi từ khóa hoặc bộ lọc',
                        style: TextStyle(
                          fontSize: 13,
                          color: theme.colorScheme.onSurface.withOpacity(0.6),
                        ),
                      ),
                    ],
                  ),
                );
              }

              return ListView.builder(
                padding: EdgeInsets.symmetric(
                  horizontal: horizontalPadding,
                  vertical: verticalPadding,
                ),
                itemCount: filteredStores.length,
                itemBuilder: (context, index) => _buildSearchResultCard(
                  filteredStores[index],
                  screenSize,
                  theme,
                  verticalPadding,
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterTag({
    required String label,
    required IconData icon,
    required ThemeData theme,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: theme.colorScheme.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: theme.colorScheme.primary.withOpacity(0.3),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 14,
            color: theme.colorScheme.primary,
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: theme.colorScheme.primary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchResultCard(
    dynamic store,
    Size screenSize,
    ThemeData theme,
    double verticalPadding,
  ) {
    return GestureDetector(
      onTap: () {
        Get.to(
          () => StoreBookingScreen(fields: BookingMockData.getFakeFields()),
        );
      },
      child: Container(
        margin: EdgeInsets.only(bottom: verticalPadding * 1.2),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
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
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Row(
            children: [
              // Image
              Container(
                width: screenSize.width * 0.25,
                height: screenSize.width * 0.25,
                decoration: BoxDecoration(
                  color: theme.colorScheme.surface,
                ),
                child: Image.network(
                  store.avatarUrl ?? '',
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      color: theme.colorScheme.surfaceVariant,
                      child: Icon(
                        Icons.image_not_supported_outlined,
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    );
                  },
                ),
              ),

              // Info
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            store.name,
                            style: TextStyle(
                              fontSize: 14,
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
                                color: theme.colorScheme.onSurface
                                    .withOpacity(0.6),
                              ),
                              const SizedBox(width: 3),
                              Expanded(
                                child: Text(
                                  store.ward.toString(),
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: theme.colorScheme.onSurface
                                        .withOpacity(0.6),
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          // Rating
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.primary
                                  .withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.star,
                                  color: Color(0xFFFFB300),
                                  size: 14,
                                ),
                                const SizedBox(width: 3),
                                Text(
                                  store.averageRating
                                          ?.toStringAsFixed(1) ??
                                      '4.5',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: theme.colorScheme.primary,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          // View Count
                          Row(
                            children: [
                              Icon(
                                Icons.remove_red_eye_outlined,
                                size: 13,
                                color: theme.colorScheme.onSurface
                                    .withOpacity(0.6),
                              ),
                              const SizedBox(width: 3),
                              Text(
                                "${store.viewCount}",
                                style: TextStyle(
                                  fontSize: 12,
                                  color: theme.colorScheme.onSurface
                                      .withOpacity(0.6),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // Arrow
              Container(
                padding: const EdgeInsets.all(12),
                child: Icon(
                  Icons.chevron_right,
                  color: theme.colorScheme.primary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}