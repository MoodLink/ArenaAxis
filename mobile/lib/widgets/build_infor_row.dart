import 'package:flutter/material.dart';


Widget buildInfoRow(IconData icon, String text, Size screenSize) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey[600]),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              fontSize: screenSize.width * 0.036,
              color: Colors.grey[700],
            ),
          ),
        ),
      ],
    );
  }
