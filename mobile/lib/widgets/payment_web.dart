// widgets/payment_web.dart

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:webview_flutter/webview_flutter.dart';

class PaymentWebView extends StatefulWidget {
  final String url;
  const PaymentWebView({Key? key, required this.url}) : super(key: key);

  @override
  State<PaymentWebView> createState() => _PaymentWebViewState();
}

class _PaymentWebViewState extends State<PaymentWebView> {
  late final WebViewController _controller;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0x00000000))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            setState(() => _isLoading = true);
          },
          onPageFinished: (String url) {
            setState(() => _isLoading = false);

            // BẮT CHÍNH XÁC TRANG THÀNH CÔNG
            if (url.contains('/payment/success') ||
                url.contains('vnp_ResponseCode=00') ||
                url.contains('resultCode=0') ||
                url.contains('success=true')) {
              Get.back(result: 'success');
              return;
            }

            // BẮT TRANG THẤT BẠI / HỦY
            if (url.contains('/payment/cancel') ||
                url.contains('/payment/failure') ||
                url.contains('vnp_ResponseCode=') && !url.contains('vnp_ResponseCode=00') ||
                url.contains('resultCode=') && !url.contains('resultCode=0')) {
              Get.back(result: 'failed');
              return;
            }
          },
          // Để chắc chắn hơn, bắt luôn khi load trang localhost:3000/payment/success
          onNavigationRequest: (NavigationRequest request) {
            if (request.url.contains('/payment/success')) {
              Get.back(result: 'success');
              return NavigationDecision.prevent; // không load trang success nữa
            }
            if (request.url.contains('/payment/cancel') ||
                request.url.contains('/payment/failed')) {
              Get.back(result: 'failed');
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(Uri.parse(widget.url));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Thanh toán'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Get.back(result: 'cancel'),
        ),
      ),
      body: Stack(
        children: [
          WebViewWidget(controller: _controller),
          if (_isLoading)
            const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
              ),
            ),
        ],
      ),
    );
  }
}