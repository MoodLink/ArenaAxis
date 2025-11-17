import 'package:flutter/material.dart';
import 'package:percent_indicator/flutter_percent_indicator.dart';

class ProgressBar extends StatelessWidget {
  double percent;
   ProgressBar({super.key, required this.percent});

  @override
  Widget build(BuildContext context) {
    return LinearPercentIndicator(
        width: 100.0,
        lineHeight: 8.0,
        percent: percent,
        barRadius:Radius.circular(5) ,
        progressColor: Theme.of(context).colorScheme.inversePrimary,
        curve: Curves.easeInOut,
        animateFromLastPercent: true,
      );
  }
}