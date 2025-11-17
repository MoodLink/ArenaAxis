import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:lottie/lottie.dart';

Widget loadingIndicator() {
  return Center(
    child: Container(
              color: Colors.black.withOpacity(0.02),
              child: Center(
                child: ClipOval(
                  child: Lottie.asset(
                    'assets/lottie/loading.json',
                    height: 85,
                    width: 85,
                  ),
                ),
              ),
            ),
  );
}