import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:carousel_slider/carousel_slider.dart';

class LoginHeader extends StatelessWidget {
  const LoginHeader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final List<String> images = [
      'assets/images/login_1.webp',
      'assets/images/login_2.webp',
      'assets/images/login_3.webp',
      'assets/images/login_4.webp',
      'assets/images/login_5.webp',
      'assets/images/login_6.webp',
    ];

    return Column(
      children: [
        ClipRRect(
          borderRadius: const BorderRadius.only(
            bottomLeft: Radius.circular(10),
            bottomRight: Radius.circular(10),
          ),
          child: CarouselSlider(
            options: CarouselOptions(
              height: MediaQuery.of(context).size.height * 0.3,
              viewportFraction: 1, 
              autoPlay: true, 
              autoPlayInterval: const Duration(seconds: 3),
              autoPlayAnimationDuration: const Duration(milliseconds: 800),
              enableInfiniteScroll: true,
            ),
            items: images.map((path) {
              return Image.asset(
                path,
                width: MediaQuery.of(context).size.width,
                fit: BoxFit.cover,
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 30),
        Text(
          'Let’s Connect With Us!',
          style: GoogleFonts.workbench(
            fontSize: 30,
            fontWeight: FontWeight.bold,
            color: Color(0xFFFD6326),
          ),
        ),
      ],
    );
  }
}
