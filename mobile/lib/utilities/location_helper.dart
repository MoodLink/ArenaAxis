import 'dart:developer';

import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';
import 'package:mobile/utilities/local_storage.dart';


class LocationHelper {
  Future<Map<String, dynamic>?> getUserLocation() async {
    
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return null;

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return null;
    }
    if (permission == LocationPermission.deniedForever) return null;

    try {
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      List<Placemark> placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );

      if (placemarks.isNotEmpty) {
        Placemark place = placemarks[0];
  
        final locationData = {
          "latitude": position.latitude,
          "longitude": position.longitude,
          "ward":
              "${place.subAdministrativeArea}",
          "province": "${place.administrativeArea}",
        };
        await LocalStorageHelper.clearLocation();
        log("Location Data: $locationData");
        await LocalStorageHelper.saveLocation(locationData);
        
        return locationData;
      }
    } catch (e) {
      print("Error getting location: $e");
    }

    return null;
  }
}
