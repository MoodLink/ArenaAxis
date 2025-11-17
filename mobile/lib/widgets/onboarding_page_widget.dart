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
      padding: const EdgeInsets.symmetric(horizontal: 20),
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
              margin: const EdgeInsets.all(10),
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
              child: ClipRRect(
                borderRadius: BorderRadius.circular(120),
                child: Image.asset(
                  'assets/images/on_boarding_${currentPage + 1}.webp',
                  fit: BoxFit.contain,
                ),
              )
            ),
          ),
          
          const SizedBox(height: 20),
          
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
              fontSize: 17,
              fontWeight: FontWeight.w500,
              color: Colors.black87,
            ),
            textAlign: TextAlign.center,
          ),
          // Description
          Text(
            data.description,
            style: TextStyle(
              fontSize: 15,
              color: Colors.grey[800],
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}