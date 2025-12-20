import 'package:get/get.dart';
import 'package:mobile/controller/booking_controller.dart';
import 'package:mobile/controller/chat_controller.dart';
import 'package:mobile/controller/field_controller.dart';
import 'package:mobile/controller/field_search_controller.dart';
import 'package:mobile/controller/home_controller.dart';
import 'package:mobile/controller/post_controller.dart';
import 'package:mobile/controller/post_search_controller.dart';
import 'package:mobile/controller/store_controller.dart';
import 'package:mobile/controller/sport_category_controller.dart';
import 'package:mobile/services/location_service.dart';

class AppBinding extends Bindings {
  @override
  void dependencies() {
    Get.put(HomeController());
    Get.put(StoreController());
    Get.put(LocationService());
    Get.put(FieldSearchController());
    Get.put(SportCategoryController());
    Get.put(FieldController());
    Get.put(BookingsController());
    Get.put(PostSearchController());
    Get.put(PostController());
    Get.put(ChatController());
  }
}
