import 'package:get/get.dart';
import 'package:mobile/models/location.dart';
import 'package:mobile/services/location_service.dart';


class FieldSearchController extends GetxController {
  var selectedProvince = Rx<Province?>(null);
  var selectedWard = Rx<Ward?>(null);
  var searchQuery = ''.obs;

  var provinces = <Province>[].obs;
  var wards = <Ward>[].obs;
  var isLoadingProvinces = false.obs;
  var isLoadingWards = false.obs;

  late LocationService locationService;

  @override
  void onInit() {
    super.onInit();
    locationService = Get.find<LocationService>();
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
    selectedWard.value = null;
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

  void setWard(Ward ward) {
    selectedWard.value = ward;
  }

  void updateSearchQuery(String query) {
    searchQuery.value = query;
  }

  void clearFilters() {
    selectedProvince.value = null;
    selectedWard.value = null;
    searchQuery.value = '';
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
