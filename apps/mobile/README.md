# apps/mobile - InSpot Mobile App (Flutter)

Status: Flutter Foundation chunk of Sprint 1 (chunk 4) is scaffolded. No business screens yet.

Contains: feature-first `lib/` structure, Riverpod for state + DI (DEC-004), a `go_router` skeleton with a single splash route (`lib/core/router/`), the purple/nightlife-modern-minimal theme (`lib/core/theme/`), a splash screen (`lib/features/splash/`), `pubspec.yaml` pinned to DEC-004's stack (Riverpod, go_router, Dio, flutter_secure_storage, shared_preferences, reactive_forms, intl), `flutter_lints`-based `analysis_options.yaml`, and a smoke widget test.

**Known gap** (see `../../docs/backlog.md`): this machine has no Flutter/Dart SDK installed, so `ios/`, `android/` native projects and dev/staging/prod flavors were **not** generated — those need `flutter create` to be correct, not hand-authoring. Run `flutter create .` from this directory once the Flutter SDK is available (it fills in native folders around the existing `lib/` without touching it), then `flutter pub get && flutter analyze && flutter test` to verify this scaffold.

See ../../docs/ARCHITECTURE.md and ../../docs/decisions/ for binding standards.
