import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/field_search_controller.dart';
import 'package:mobile/models/location.dart';
import 'package:mobile/screens/Search_result_page.dart';

class FieldSearchWidget extends StatelessWidget {
  final Function(String, Province?, Ward?)? onSearch;
  final ThemeData theme;
  final Size screenSize;

  const FieldSearchWidget({
    super.key,
    this.onSearch,
    required this.theme,
    required this.screenSize,
  });

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(FieldSearchController());

    return Container(
      padding: EdgeInsets.all(screenSize.width * 0.02),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search Bar
          Container(
            height: 55,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.15),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    onChanged: (value) => controller.updateSearchQuery(value),
                    onSubmitted: (value) => _performSearch(
                      context,
                      value,
                      controller,
                    ),
                    decoration: InputDecoration(
                      hintText: 'Tìm sân, địa điểm...',
                      hintStyle: TextStyle(
                        color: Colors.grey[500],
                        fontSize: screenSize.width * 0.038,
                      ),
                      prefixIcon: Icon(
                        Icons.search,
                        color: Colors.grey[600],
                        size: 22,
                      ),
                      border: InputBorder.none,
                      contentPadding:
                          const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                // Location Filter Button
                Container(
                  width: 55,
                  decoration: BoxDecoration(
                    border: Border(
                      left: BorderSide(
                        color: Colors.grey[300]!,
                      ),
                    ),
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () => _showLocationPicker(context, controller),
                      child: Icon(
                        Icons.location_on_outlined,
                        color: Colors.blue[600],
                        size: 22,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          SizedBox(height: screenSize.height * 0.012),

          // Active Filters Display
          Obx(() {
            final hasFilters = controller.selectedWard.value != null ||
                controller.selectedProvince.value != null ||
                controller.searchQuery.isNotEmpty;

            return hasFilters
                ? Wrap(
                    spacing: 8,
                    children: [
                      if (controller.searchQuery.isNotEmpty)
                        _buildFilterChip(
                          context,
                          icon: Icons.search,
                          label: controller.searchQuery.value,
                          onRemove: () =>
                              controller.updateSearchQuery(''),
                          theme: theme,
                        ),
                      if (controller.selectedProvince.value != null)
                        _buildFilterChip(
                          context,
                          icon: Icons.map,
                          label:
                              controller.selectedProvince.value!.name,
                          onRemove: () =>
                              controller.clearFilters(),
                          theme: theme,
                        ),
                      if (controller.selectedWard.value != null)
                        _buildFilterChip(
                          context,
                          icon: Icons.location_on,
                          label:
                              controller.selectedWard.value!.name,
                          onRemove: () =>
                              controller.setWard(
                                  controller.selectedWard.value!),
                          theme: theme,
                        ),
                      if (controller.searchQuery.isNotEmpty)
                        GestureDetector(
                          onTap: () => _performSearch(
                            context,
                            controller.searchQuery.value,
                            controller,
                          ),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: Colors.blue[400]!,
                                width: 1.5,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  blurRadius: 4,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.search,
                                  size: 14,
                                  color: Colors.blue[600],
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  'Tìm kiếm',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.blue[600],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      if (hasFilters && controller.searchQuery.isEmpty)
                        GestureDetector(
                          onTap: () => controller.clearFilters(),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: Colors.red[400]!,
                                width: 1.5,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  blurRadius: 4,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.close,
                                  size: 14,
                                  color: Colors.red[600],
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  'Xóa',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.red[600],
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  )
                : const SizedBox.shrink();
          }),
        ],
      ),
    );
  }

  Widget _buildFilterChip(
    BuildContext context, {
    required IconData icon,
    required String label,
    required VoidCallback onRemove,
    required ThemeData theme,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.blue[400]!,
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 14,
            color: Colors.blue[600],
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.blue[700],
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(width: 6),
          GestureDetector(
            onTap: onRemove,
            child: Icon(
              Icons.close,
              size: 14,
              color: Colors.blue[600],
            ),
          ),
        ],
      ),
    );
  }

  void _performSearch(
    BuildContext context,
    String query,
    FieldSearchController controller,
  ) {
    if (query.isEmpty) return;
    log('Performing search for: $query');
    Get.to(
      () => SearchResultsPage(
        searchQuery: query,
        provinceFilter:
            controller.selectedProvince.value?.name,
        wardFilter: controller.selectedWard.value?.name,
      ),
    );
  }

  void _showLocationPicker(
    BuildContext context,
    FieldSearchController controller,
  ) {
    showModalBottomSheet(
      context: context,
      builder: (context) => _LocationPickerModal(controller: controller),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      backgroundColor: Colors.grey[50],
    );
  }
}

class _LocationPickerModal extends StatelessWidget {
  final FieldSearchController controller;

  const _LocationPickerModal({required this.controller});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.85,
      ),
      color: theme.colorScheme.surface,
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border(
                bottom: BorderSide(
                  color: theme.colorScheme.outlineVariant,
                ),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Chọn địa điểm',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Icon(
                    Icons.close,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
              ],
            ),
          ),

          Expanded(
            child: Obx(() {
              if (controller.selectedProvince.value == null) {
                // Show provinces
                if (controller.isLoadingProvinces.value) {
                  return Center(
                    child: CircularProgressIndicator(
                      color: theme.colorScheme.primary,
                    ),
                  );
                }

                if (controller.provinces.isEmpty) {
                  return Center(
                    child: Text(
                      'Không có dữ liệu',
                      style: TextStyle(
                        color: theme.colorScheme.onSurface,
                      ),
                    ),
                  );
                }

                return ListView.builder(
                  itemCount: controller.provinces.length,
                  itemBuilder: (context, index) {
                    final province = controller.provinces[index];
                    return _buildProvinceItem(
                      context,
                      province,
                      controller,
                      theme,
                    );
                  },
                );
              } else {
                // Show wards
                if (controller.isLoadingWards.value) {
                  return Center(
                    child: CircularProgressIndicator(
                      color: theme.colorScheme.primary,
                    ),
                  );
                }

                if (controller.wards.isEmpty) {
                  return Center(
                    child: Text(
                      'Không có quận/huyện',
                      style: TextStyle(
                        color: theme.colorScheme.onSurface,
                      ),
                    ),
                  );
                }

                return Column(
                  children: [
                    // Back button
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        border: Border(
                          bottom: BorderSide(
                            color: theme.colorScheme.outlineVariant,
                          ),
                        ),
                      ),
                      child: Row(
                        children: [
                          GestureDetector(
                            onTap: () {
                              controller.selectedProvince.value = null;
                            },
                            child: Row(
                              children: [
                                Icon(
                                  Icons.arrow_back_ios,
                                  size: 16,
                                  color: theme.colorScheme.primary,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  'Quay lại',
                                  style: TextStyle(
                                    color: theme.colorScheme.primary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: ListView.builder(
                        itemCount: controller.wards.length,
                        itemBuilder: (context, index) {
                          final ward = controller.wards[index];
                          return _buildWardItem(
                            context,
                            ward,
                            controller,
                            theme,
                          );
                        },
                      ),
                    ),
                  ],
                );
              }
            }),
          ),

          // Confirm button
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(
                  color: theme.colorScheme.outlineVariant,
                ),
              ),
            ),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.colorScheme.primary,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: const Text(
                  'Xác nhận',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProvinceItem(
    BuildContext context,
    Province province,
    FieldSearchController controller,
    ThemeData theme,
  ) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => controller.setProvince(province),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.map_outlined,
                    color: theme.colorScheme.primary,
                    size: 20,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    province.name,
                    style: TextStyle(
                      fontSize: 15,
                      color: theme.colorScheme.onSurface,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              Icon(
                Icons.chevron_right,
                color: theme.colorScheme.onSurface.withOpacity(0.5),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWardItem(
    BuildContext context,
    Ward ward,
    FieldSearchController controller,
    ThemeData theme,
  ) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          controller.setWard(ward);
          Navigator.pop(context);
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              Icon(
                Icons.location_on_outlined,
                color: theme.colorScheme.primary,
                size: 18,
              ),
              const SizedBox(width: 12),
              Text(
                ward.name,
                style: TextStyle(
                  fontSize: 15,
                  color: theme.colorScheme.onSurface,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}