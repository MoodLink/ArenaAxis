class PricingDetail {
  final double specialPrice;
  final String startAt;
  final String endAt;

  PricingDetail({
    required this.specialPrice,
    required this.startAt,
    required this.endAt,
  });

  factory PricingDetail.fromJson(Map<String, dynamic> json) {
    return PricingDetail(
      specialPrice: double.tryParse(json['specialPrice'].toString()) ?? 0.0,
      startAt: json['startAt'] ?? '',
      endAt: json['endAt'] ?? '',
    );
  }
}

class FieldPricingResponse {
  // Bỏ defaultPrice khỏi Model này nếu API không trả về nó ở đây
  // Hoặc dùng nullable nếu cần: final double? defaultPrice;
  final Map<String, List<PricingDetail>> pricings;

  FieldPricingResponse({required this.pricings});

  factory FieldPricingResponse.fromJson(Map<String, dynamic> json) {
    var data = json['data'];
    if (data == null) return FieldPricingResponse(pricings: {});

    Map<String, List<PricingDetail>> pricingMap = {};

    // API của bạn chỉ trả về Map<Ngày, List<PricingDetail>> ngay trong data
    Map<String, dynamic> rawPricings = data;

    rawPricings.forEach((key, value) {
      // Đảm bảo key là tên ngày (monday, tuesday...)
      if (value is List) {
        pricingMap[key] = value.map((e) => PricingDetail.fromJson(e)).toList();
      }
    });

    return FieldPricingResponse(
      // defaultPrice: defPrice, // Không cần thiết nếu API không cung cấp
      pricings: pricingMap,
    );
  }
}
