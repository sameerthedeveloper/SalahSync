# SalahSync

**Scan Once. Pray on Time.**

SalahSync is a privacy-focused mobile app that keeps prayer reminders in sync with your local mosque's timetable. Photograph or import a mosque timetable, and the app reads it on-device, identifies the mosque, stores the timetable, and schedules prayer notifications.

> Status: early development. See the [PRD](docs/PRD.md) for the full specification, which is the source of truth for v1.

## How it works

1. Scan or import a mosque timetable (camera, gallery, share sheet).
2. Native OCR reads the text and layout coordinates (Apple Vision on iOS, Google ML Kit on Android).
3. An on-device parser/model converts the OCR output into a strict, validated JSON schema.
4. The mosque is identified using image EXIF GPS, device location, the OCR'd mosque name, and a nearby-mosque search.
5. You review and correct the timetable. Nothing is scheduled from an uncertain timetable.
6. The timetable is saved locally and prayer reminders are scheduled.
7. Scanning a later timetable from the same mosque recognizes it and updates the existing record, keeping history.

## Principles

- **Local-first, offline-first.** Scanning, OCR, parsing, storage and notifications work without internet. Only mosque search and geocoding need a connection.
- **Privacy-first.** Images, GPS, OCR text and mosque history stay on the device.
- **No mandatory platform AI.** No dependency on Apple Intelligence, Galaxy AI or Gemini Nano.
- **Never invent a prayer time.** Missing or unclear values are `null` and flagged for user review.
- **No backend in v1.** No accounts, no cloud sync.

## Tech stack

- React Native + Expo (development build, not Expo Go)
- TypeScript (strict)
- Expo Router
- NativeWind
- Zustand
- Expo SQLite
- iOS: Apple Vision (OCR), Core ML (local models)
- Android: Google ML Kit (OCR), LiteRT / ONNX Runtime (local models)

## Project structure

```text
src/
├── app/          # Expo Router screens
├── components/   # ui, ios, android
├── features/     # scanner, ocr, timetable, ai, mosque, prayers,
│                 # notifications, location, settings
├── database/
├── services/
├── hooks/
├── stores/
├── types/
├── constants/
└── utils/
```

Domain logic stays separate from UI. OCR and AI sit behind `OCRProvider` and `LocalAIProvider` interfaces so screens never call platform code directly.

## Getting started

Prerequisites: Node.js, Xcode (iOS) and/or Android Studio (Android), and a physical device for camera testing.

```bash
npm install
npx expo run:ios
npx expo run:android
```

The app uses native modules, so it must run as a development build.

## Roadmap

1. Foundation (Expo, TypeScript, NativeWind, Router, Zustand, SQLite, theme)
2. Scanner (camera, gallery, crop, rotate, EXIF preservation)
3. OCR (Vision / ML Kit into a common `OCRDocument`)
4. Local AI (provider interface, parser, schema, validation, confidence)
5. Mosque (GPS, EXIF GPS, search, matching, My Mosques)
6. Timetable management (history, automatic updates)
7. Prayer notifications (scheduling, Adhan, permissions)
8. Polish (accessibility, error states, dark mode, onboarding, testing)

First milestone: Launch → Home → Scan → Camera → Capture → OCR → show OCR result, on iPhone 13.

## License

MIT. See [LICENSE](LICENSE).
