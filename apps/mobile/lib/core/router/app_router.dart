import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";

import "../../features/splash/splash_screen.dart";

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: "/",
    routes: [
      GoRoute(
        path: "/",
        name: "splash",
        builder: (context, state) => const SplashScreen(),
      ),
      // Onboarding/auth/home routes are added once their own feature is scoped and approved (DEC-011).
    ],
  );
});
