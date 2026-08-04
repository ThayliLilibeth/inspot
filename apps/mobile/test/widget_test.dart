import "package:flutter/material.dart";
import "package:flutter_test/flutter_test.dart";
import "package:inspot_mobile/features/splash/splash_screen.dart";

void main() {
  testWidgets("SplashScreen renders the InSpot wordmark", (tester) async {
    await tester.pumpWidget(const MaterialApp(home: SplashScreen()));

    expect(find.text("InSpot"), findsOneWidget);
  });
}
