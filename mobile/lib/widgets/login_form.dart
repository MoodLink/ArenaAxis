import 'package:flutter/material.dart';

class LoginForm extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final bool isPasswordVisible;
  final Function(bool) onPasswordVisibilityChange;

  const LoginForm({
    super.key,
    required this.formKey,
    required this.emailController,
    required this.passwordController,
    required this.isPasswordVisible,
    required this.onPasswordVisibilityChange,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      child: Form(
        key: formKey,
        child: Column(
          children: [
            // Email field
            TextFormField(
              key: const Key('emailField'),
              controller: emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                labelText: 'Username / Email',
                prefixIcon: const Icon(Icons.email),
                filled: true,
                fillColor: Theme.of(context).colorScheme.secondaryContainer,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Vui lòng nhập email';
                }
                final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+');
                if (!emailRegex.hasMatch(value)) {
                  return 'Email không hợp lệ';
                }
                return null;
              },
            ),

            const SizedBox(height: 24),

            // Password field
            TextFormField(
              key : const Key('passwordField'), 
              controller: passwordController,
              obscureText: !isPasswordVisible,
              decoration: InputDecoration(
                labelText: 'Password',
                prefixIcon: const Icon(Icons.lock),
                filled: true,
                fillColor: Theme.of(context).colorScheme.secondaryContainer,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                suffixIcon: IconButton(
                  icon: Icon(
                    isPasswordVisible ? Icons.visibility : Icons.visibility_off,
                  ),
                  onPressed: () =>
                      onPasswordVisibilityChange(!isPasswordVisible),
                ),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Vui lòng nhập vào password';
                }
                return null;
              },
            ),
          ],
        ),
      ),
    );
  }
}
