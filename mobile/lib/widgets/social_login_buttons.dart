import 'package:flutter/material.dart';

class SocialLoginButtons extends StatelessWidget {
  final VoidCallback onGoogleLogin;
  final VoidCallback onFacebookLogin;

  const SocialLoginButtons({
    Key? key,
    required this.onGoogleLogin,
    required this.onFacebookLogin,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12.0),
      child: Row(
        children: [
          Expanded(
            child: OutlinedButton.icon(
              onPressed: onGoogleLogin,
              icon: const Icon(Icons.g_mobiledata, size: 40),
              label: const Text('Google', style:  TextStyle(fontSize: 18),),
              style: OutlinedButton.styleFrom(
                foregroundColor: Theme.of(context).colorScheme.onSurface,
                side: BorderSide(color: Theme.of(context).dividerColor),
                padding: const EdgeInsets.symmetric(vertical: 5),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: OutlinedButton.icon(
              onPressed: onFacebookLogin,
              icon: const Icon(Icons.facebook, size: 24),
              label: const Text('Facebook', style:  TextStyle(fontSize: 18),),
              style: OutlinedButton.styleFrom(
                foregroundColor: Theme.of(context).colorScheme.onSurface,
                side: BorderSide(color: Theme.of(context).dividerColor),
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
