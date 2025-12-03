import 'package:get/get.dart';
import 'package:mobile/models/location.dart';
import 'package:mobile/services/location_service.dart';
import 'package:mobile/controller/store_controller.dart';
import 'package:mobile/controller/sport_category_controller.dart';

class FieldSearchController extends GetxController {
  var selectedProvince = Rx<Province?>(null);
  var selectedWard = Rx<Ward?>(null);
  var selectedProvinceId = ''.obs;
  var selectedWardId = ''.obs;
  var searchQuery = ''.obs;

  var provinces = <Province>[].obs;
  var wards = <Ward>[].obs;
  var isLoadingProvinces = false.obs;
  var isLoadingWards = false.obs;

  late LocationService locationService;
  late StoreController storeController;
  late SportCategoryController sportCategoryController;

  @override
  void onReady() {
    super.onReady();
    sportCategoryController =
        Get.find<SportCategoryController>(); // ✔ KHÔNG gọi trong onInit
  }

  @override
  void onInit() {
    super.onInit();
    locationService = Get.find<LocationService>();
    storeController = Get.find<StoreController>();
    _loadProvinces();
  }

  Future<void> _loadProvinces() async {
    try {
      isLoadingProvinces.value = true;
      final data = await locationService.fetchProvinces();
      provinces.value = data;
    } catch (e) {
      print('Error: $e');
      Get.snackbar('Lỗi', 'Không thể tải danh sách tỉnh/thành phố');
    } finally {
      isLoadingProvinces.value = false;
    }
  }

  Future<void> setProvince(Province province) async {
    selectedProvince.value = province;
    selectedProvinceId.value = province.id;
    selectedWard.value = null;
    selectedWardId.value = '';
    performSearch();
    await _loadWards(province.id);
  }

  Future<void> _loadWards(String provinceId) async {
    try {
      isLoadingWards.value = true;
      wards.value = [];
      final data = await locationService.fetchWards(provinceId);
      wards.value = data;
    } catch (e) {
      print('Error: $e');
      Get.snackbar('Lỗi', 'Không thể tải danh sách quận/huyện');
    } finally {
      isLoadingWards.value = false;
    }
  }

  /// Chọn ward và query kết hợp với sport category
  Future<void> setWard(Ward ward) async {
    selectedWard.value = ward;
    selectedWardId.value = ward.id;
    await _performSearch();
  }

  void updateSearchQuery(String query) {
    searchQuery.value = query;
  }

  Future<void> performSearch() async {
    await _performSearch();
  }

  /// Query sân kết hợp: search query + location + sport category
  Future<void> _performSearch() async {
    await storeController.searchStores(
      name: searchQuery.value,
      wardId: selectedWardId.value.isEmpty ? null : selectedWardId.value,
      provinceId: selectedProvinceId.value.isEmpty
          ? null
          : selectedProvinceId.value,
      sportId: sportCategoryController.selectedCategoryId.value ?? '',
    );
  }

  /// Kiểm tra xem còn filter nào không
  bool hasAnyFilter() {
    return searchQuery.value.isNotEmpty ||
        selectedWard.value != null ||
        selectedProvince.value != null ||
        sportCategoryController.selectedCategory.value != null;
  }

  /// Xóa hết filters và quay về nearby search
  void clearAllFilters() {
    selectedProvince.value = null;
    selectedWard.value = null;
    selectedProvinceId.value = '';
    selectedWardId.value = '';
    searchQuery.value = '';
    sportCategoryController.clearSelection();
    // Quay về tìm kiếm nearby
    storeController.fetchStores();
  }

  /// Xóa location filter riêng
  void clearLocationFilter() {
    selectedProvince.value = null;
    selectedWard.value = null;
    selectedProvinceId.value = '';
    selectedWardId.value = '';
    // Kiểm tra nếu còn filter khác, thì tiếp tục search
    if (hasAnyFilter()) {
      performSearch();
    } else {
      // Nếu bỏ hết, quay về nearby
      storeController.fetchStores();
    }
  }

  /// Xóa search query riêng
  void clearSearchQuery() {
    searchQuery.value = '';
    // Kiểm tra nếu còn filter khác, thì tiếp tục search
    if (hasAnyFilter()) {
      performSearch();
    } else {
      // Nếu bỏ hết, quay về nearby
      storeController.fetchStores();
    }
  }

  String getLocationDisplay() {
    if (selectedWard.value != null) {
      return '${selectedWard.value!.name}, ${selectedProvince.value!.name}';
    } else if (selectedProvince.value != null) {
      return selectedProvince.value!.name;
    }
    return 'Chọn địa điểm';
  }
}
