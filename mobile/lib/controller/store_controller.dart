import 'dart:developer';

import 'package:get/get.dart';
import 'package:mobile/models/Store.dart';
import 'package:mobile/services/store_service.dart';
import 'package:mobile/utilities/local_storage.dart';

class StoreController extends GetxController {
  final stores = <Store>[].obs;
  final isLoading = false.obs;
  final StoreService _storeService = StoreService();
  
  @override
  void onInit() {
    super.onInit();
    fetchStores();
  }

  /// distance optional, default = 10000
  Future<void> fetchStores({int distance = 10000}) async {
    try {
      isLoading.value = true;

      // Lấy tọa độ từ local storage
      final latitude = await LocalStorageHelper.getLatitude();
      final longitude = await LocalStorageHelper.getLongitude();
      final ward      = await LocalStorageHelper.getWard();
      final province  = await LocalStorageHelper.getProvince();
      final result = await _storeService.getStoresNearby(
        latitude: latitude,
        longitude: longitude,
        distance: distance,
        wardName: ward,
        provinceName: province,
      );

      log('Fetched ${result.length} stores');
      stores.assignAll(result);
    } catch (e) {
      Get.snackbar('Lỗi', e.toString());
    } finally {
      isLoading.value = false;
    }
  }
}
