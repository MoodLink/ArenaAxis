import 'package:get/get.dart';
import 'package:mobile/screens/create_post_screen.dart';
import 'package:mobile/screens/selected_matches_screen.dart';


class AppRoutes {
  static const selectMatches = '/select-matches';
  static const createPost = '/create-post';

  static final routes = <GetPage>[
    GetPage(
      name: selectMatches,
      page: () {
        final args = Get.arguments as Map<String, dynamic>;
        return SelectMatchesPage(
          orderId: args['orderId'],
        );
      },
    ),
    GetPage(
      name: createPost,
      page: () => const CreatePostPage(),
    ),
  ];
}
