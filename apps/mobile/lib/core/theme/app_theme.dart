import "package:flutter/material.dart";

/// Purple, nightlife-modern-minimal palette per TEC-001's UX principles.
/// No product screens consume this yet — splash only (Flutter Foundation scope).
abstract final class AppTheme {
  static const Color _primaryPurple = Color(0xFF6C4FF6);
  static const Color _secondaryPurple = Color(0xFF9B7BFF);
  static const Color _darkBackground = Color(0xFF0F0B1E);
  static const Color _lightBackground = Color(0xFFFAF9FF);

  static ThemeData get light => ThemeData(
    brightness: Brightness.light,
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: _primaryPurple,
      brightness: Brightness.light,
    ),
    scaffoldBackgroundColor: _lightBackground,
  );

  static ThemeData get dark => ThemeData(
    brightness: Brightness.dark,
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: _secondaryPurple,
      brightness: Brightness.dark,
    ),
    scaffoldBackgroundColor: _darkBackground,
  );
}
