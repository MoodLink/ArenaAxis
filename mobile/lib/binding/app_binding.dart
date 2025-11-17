import 'package:get/get.dart';
import 'package:mobile/controller/home_controller.dart';
import 'package:mobile/controller/store_controller.dart';
import 'package:mobile/providers/sport_category_controller.dart';
import 'package:mobile/services/location_service.dart';


class AppBinding extends Bindings {
  @override
  void dependencies() {
    Get.put(SportCategoryController());
    Get.put(HomeController());
    Get.put(StoreController());
    Get.put(LocationService());
  }
}
