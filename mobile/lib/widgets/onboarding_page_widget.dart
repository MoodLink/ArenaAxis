import 'package:flutter/material.dart';
import '../models/onboarding_data.dart';

class OnboardingPageWidget extends StatelessWidget {
  final OnboardingData data;
  final int currentPage;

  const OnboardingPageWidget({
    Key? key,
    required this.data,
    required this.currentPage,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 30),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Illustration with gradient background
          Container(
            height: 280,
            width: 280,
            decoration: BoxDecoration(
              gradient: RadialGradient(
                colors: [
                  data.color.withOpacity(0.2),
                  data.color.withOpacity(0.05),
                ],
              ),
              borderRadius: BorderRadius.circular(140),
            ),
            child: Container(
              margin: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(120),
                boxShadow: [
                  BoxShadow(
                    color: data.color.withOpacity(0.2),
                    blurRadius: 30,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Icon(
                _getIconForPage(currentPage),
                size: 100,
                color: data.color,
              ),
            ),
          ),
          
          const SizedBox(height: 50),
          
          // Title
          Text(
            data.title,
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: data.color,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 15),
          
          // Subtitle
          Text(
            data.subtitle,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w500,
              color: Colors.black87,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 25),
          
          // Description
          Text(
            data.description,
            style: const TextStyle(
              fontSize: 16,
              color: Colors.black54,
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  IconData _getIconForPage(int index) {
    switch (index) {
      case 0:
        return Icons.sports_soccer;
      case 1:
        return Icons.location_on;
      case 2:
        return Icons.group;
      case 3:
        return Icons.calendar_today;
      default:
        return Icons.sports_soccer;
    }
  }
}