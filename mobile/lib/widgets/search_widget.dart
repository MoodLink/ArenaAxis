import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/controller/field_search_controller.dart';
import 'package:mobile/controller/sport_category_controller.dart';
import 'package:mobile/models/location.dart';

class FieldSearchWidget extends StatefulWidget {
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
  State<FieldSearchWidget> createState() => _FieldSearchWidgetState();
}

class _FieldSearchWidgetState extends State<FieldSearchWidget> {
  late final FieldSearchController controller;
  late final SportCategoryController sportController;

  @override
  void initState() {
    super.initState();
    // Initialize controllers in initState to avoid context issues
    controller = Get.find<FieldSearchController>();
    sportController = Get.find<SportCategoryController>();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(widget.screenSize.width * 0.02),
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
                    onSubmitted: (value) => _performSearch(),
                    decoration: InputDecoration(
                      hintText: 'Tìm sân, địa điểm...',
                      hintStyle: TextStyle(
                        color: Colors.grey[500],
                        fontSize: widget.screenSize.width * 0.038,
                      ),
                      prefixIcon: Icon(
                        Icons.search,
                        color: Colors.grey[600],
                        size: 22,
                      ),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                // Location Filter Button
                Container(
                  width: 55,
                  decoration: BoxDecoration(
                    border: Border(left: BorderSide(color: Colors.grey[300]!)),
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: _showLocationPicker,
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

          SizedBox(height: widget.screenSize.height * 0.012),

          // Active Filters Display
          Obx(() {
            final hasFilters = controller.selectedWard.value != null ||
                controller.selectedProvince.value != null ||
                controller.searchQuery.isNotEmpty ||
                sportController.selectedCategory.value != null;

            return hasFilters
                ? Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      // Sport Category Badge
                      if (sportController.selectedCategory.value != null)
                        _buildSportCategoryBadge(),

                      // Search Query Badge
                      if (controller.searchQuery.isNotEmpty)
                        _buildFilterChip(
                          icon: Icons.search,
                          label: controller.searchQuery.value,
                          onRemove: () => controller.clearSearchQuery(),
                        ),

                      // Province Badge
                      if (controller.selectedProvince.value != null)
                        _buildFilterChip(
                          icon: Icons.map,
                          label: controller.selectedProvince.value!.name,
                          onRemove: () async {
                            controller.selectedProvince.value = null;
                            controller.selectedProvinceId.value = '';
                            controller.selectedWard.value = null;
                            controller.selectedWardId.value = '';
                            await controller.performSearch();
                          },
                        ),

                      // Ward Badge
                      if (controller.selectedWard.value != null)
                        _buildFilterChip(
                          icon: Icons.location_on,
                          label: controller.selectedWard.value!.name,
                          onRemove: () async {
                            controller.selectedWard.value = null;
                            controller.selectedWardId.value = '';
                            await controller.performSearch();
                          },
                        ),

                      // Search Button
                      if (controller.searchQuery.isNotEmpty)
                        GestureDetector(
                          onTap: _performSearch,
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

                      // Clear All Button
                      if (hasFilters && controller.searchQuery.isEmpty)
                        GestureDetector(
                          onTap: () {
                            controller.clearAllFilters();
                            sportController.clearSelection();
                          },
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
                                  'Xóa tất cả',
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

  Widget _buildSportCategoryBadge() {
    final selected = sportController.selectedCategory.value;
    if (selected == null) return const SizedBox.shrink();

    final color =
        sportController.getSelectedColor() ?? const Color(0xFF2196F3);

    return GestureDetector(
      onTap: () => sportController.clearSelection(),
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: 10,
          vertical: 6,
        ),
        decoration: BoxDecoration(
          color: color.withOpacity(0.5),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: color.withOpacity(0.5),
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
              sportController.getIconById(sportController.selectedCategoryId.value!),
              size: 14,
              color: Colors.white,
            ),
            const SizedBox(width: 4),
            Text(
              selected,
              style: TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(width: 6),
            Icon(
              Icons.close,
              size: 14,
              color: Colors.white,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip({
    required IconData icon,
    required String label,
    required VoidCallback onRemove,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.blue[400]!, width: 1.5),
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
          Icon(icon, size: 14, color: Colors.blue[600]),
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
            child: Icon(Icons.close, size: 14, color: Colors.blue[600]),
          ),
        ],
      ),
    );
  }

  void _performSearch() async {
    if (controller.searchQuery.isEmpty &&
        controller.selectedWard.value == null &&
        controller.selectedProvince.value == null) {
      return;
    }

    log(
      'Performing search with: query=${controller.searchQuery.value}, ward=${controller.selectedWard.value?.name}, province=${controller.selectedProvince.value?.name}',
    );

    await controller.performSearch();
  }

  void _showLocationPicker() {
    if (!mounted) return;
    
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
                bottom: BorderSide(color: theme.colorScheme.outlineVariant),
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
                  child: Icon(Icons.close, color: theme.colorScheme.onSurface),
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
                      style: TextStyle(color: theme.colorScheme.onSurface),
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
                      style: TextStyle(color: theme.colorScheme.onSurface),
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
                              controller.selectedProvinceId.value = '';
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
                top: BorderSide(color: theme.colorScheme.outlineVariant),
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
        onTap: () async {
          await controller.setWard(ward);
          if (context.mounted) {
            Navigator.pop(context);
          }
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