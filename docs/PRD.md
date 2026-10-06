# SalahSync — Complete Product Requirements & Technical Specification

## Version 1.0

**Product:** SalahSync  
**Platform:** iOS + Android  
**Framework:** React Native + Expo  
**Language:** TypeScript  
**Styling:** NativeWind  
**Architecture:** Local-first / Offline-first  
**Backend:** None for v1  
**Primary development device:** iPhone 13  
**Android baseline:** Modern Android device with Google ML Kit support

---

# 1. PRODUCT VISION

SalahSync is a privacy-focused mobile application that helps Muslims manage prayer times according to the timetable of their local mosque.

The user can photograph or import a mosque prayer timetable.

SalahSync then:

1. Reads the timetable using native OCR.
2. Uses an on-device AI/parser engine to understand the timetable.
3. Converts the extracted information into a strict structured JSON schema.
4. Uses the photograph's GPS metadata and/or the device's current location to identify the mosque.
5. Searches the web for nearby mosque information when required.
6. Adds the mosque to the user's local "My Mosques" collection.
7. Stores the timetable locally.
8. Schedules prayer reminders.
9. When the user later scans another timetable from the same mosque, automatically recognizes the existing mosque and updates its timetable.

The application must work without requiring Apple Intelligence, Samsung Galaxy AI, Gemini Nano, or any manufacturer-specific AI capability.

Platform AI capabilities may be used as accelerators, but they must never be mandatory.

---

# 2. CORE PRODUCT PRINCIPLE

The fundamental product principle is:

> Scan once. Identify the mosque. Store the timetable. Keep prayer reminders synchronized.

SalahSync is NOT primarily a prayer-time calculation application.

It follows the timetable provided by the user's mosque.

Calculated prayer times may be considered as a future feature but must not replace the mosque timetable in v1.

---

# 3. PRIMARY USER FLOW

```text
Open SalahSync
       ↓
Scan Timetable
       ↓
Capture / Import Image
       ↓
Image Processing
       ↓
Native OCR
       ↓
OCR Result + Layout Coordinates
       ↓
Local AI / Timetable Parser
       ↓
Strict JSON Output
       ↓
Validation
       ↓
Extract Mosque Name
       ↓
Read Image GPS Metadata
       ↓
Get Current GPS if required
       ↓
Search Nearby Mosques
       ↓
Match Mosque
       ↓
User Confirmation if confidence is low
       ↓
Save Mosque
       ↓
Save Timetable
       ↓
Schedule Prayer Notifications
       ↓
Complete
```

---

# 4. SECONDARY USER FLOW — FUTURE TIMETABLE

When the user scans another timetable:

```text
Scan New Timetable
       ↓
OCR
       ↓
Local AI
       ↓
Extract GPS
       ↓
Compare with My Mosques
       ↓
Existing Mosque Match?
       │
       ├── YES
       │     ↓
       │   Check timetable period/version
       │     ↓
       │   Update existing mosque
       │     ↓
       │   Reschedule notifications
       │
       └── NO
             ↓
           Find Mosque
             ↓
           Add New Mosque
```

The user should not have to manually select the mosque every time if the application can confidently identify it.

---

# 5. TECHNOLOGY STACK

## Core

- React Native
- Expo
- TypeScript
- Expo Router
- NativeWind
- Zustand
- Expo SQLite

## iOS

- Apple Vision Framework for OCR
- Core ML for local ML models where required
- Native iOS notification capabilities
- Native iOS audio capabilities
- iOS location services
- EXIF metadata extraction

## Android

- Google ML Kit Text Recognition
- LiteRT / TensorFlow Lite or ONNX Runtime for local model inference where required
- Android notification APIs
- Android location services
- EXIF metadata extraction

## Image

- Expo Camera
- Expo Image Picker
- Expo Image Manipulator

Use native modules/development builds where Expo managed APIs are insufficient.

---

# 6. EXPO REQUIREMENT

Use Expo with a Development Build.

Do NOT design the project around Expo Go as the final runtime.

The application requires native capabilities including:

- Native OCR
- Core ML
- Google ML Kit
- Native notifications
- Local audio
- GPS
- EXIF extraction
- Potential native AI runtimes

Therefore:

```bash
npx expo run:ios
npx expo run:android
```

must be supported during development.

Maintain Expo compatibility wherever practical.

---

# 7. TYPESCRIPT REQUIREMENTS

Use strict TypeScript.

Enable:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Avoid:

```ts
any
```

unless there is a documented reason.

Create explicit domain types for:

- Mosque
- Timetable
- PrayerDay
- OCRBlock
- OCRDocument
- ParsedTimetable
- AIConfidence
- MosqueMatch
- NotificationSchedule

---

# 8. APPLICATION ARCHITECTURE

Use a feature-oriented architecture.

Recommended structure:

```text
src/
│
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── scan/
│   ├── mosque/
│   ├── prayer/
│   └── settings/
│
├── components/
│   ├── ui/
│   ├── ios/
│   └── android/
│
├── features/
│   ├── scanner/
│   ├── ocr/
│   ├── timetable/
│   ├── ai/
│   ├── mosque/
│   ├── prayers/
│   ├── notifications/
│   ├── location/
│   └── settings/
│
├── database/
│
├── services/
│
├── hooks/
│
├── stores/
│
├── types/
│
├── constants/
│
└── utils/
```

Keep domain logic separate from UI.

---

# 9. PLATFORM-SPECIFIC UI

Do NOT force identical UI on iOS and Android.

The product identity must remain consistent, but each platform should follow its native design language.

## iOS

Use a modern iOS visual language inspired by Apple's current Liquid Glass design direction.

Use:

- translucent surfaces
- layered depth
- blur/material effects where appropriate
- large typography
- smooth sheets
- native navigation patterns
- SF Symbols
- subtle animations
- edge-to-edge layouts
- native iOS interaction conventions

Do not blindly imitate Apple's proprietary system UI.

The design should feel native to iOS.

---

## Android

Use a customized Material 3 design system.

Use:

- Material 3 principles
- expressive cards
- appropriate FAB usage
- Android navigation conventions
- dynamic spacing
- Android-native interaction patterns
- edge-to-edge layout
- accessible touch targets

---

# 10. DESIGN SYSTEM

Brand:

**SalahSync**

Design direction:

Modern Islamic minimalism.

Primary visual direction:

- Deep emerald
- White
- Warm gold accent
- Neutral surfaces
- Dark mode

Do not overuse Islamic decorative patterns.

The interface should feel like a modern premium mobile application rather than a traditional religious website.

---

# 11. HOME SCREEN

The home screen should show:

### Header

- SalahSync branding
- Current mosque
- Current location status

### Next Prayer

Large card:

```text
Next Prayer

Maghrib

18:28

01h 23m remaining
```

### Today's Prayer Times

```text
Fajr       04:31
Dhuhr      12:15
Asr        15:42
Maghrib    18:28
Isha       19:48
```

### Primary Action

Large scan button:

```text
Scan Timetable
```

### Mosque

Show currently selected mosque.

---

# 12. SCANNER

The scanner is the primary feature.

Support:

- Camera capture
- Gallery import
- Image sharing
- PDF import where technically feasible

Scanner should support:

- portrait
- landscape
- rotated timetable
- table layouts
- posters
- calendar layouts

Allow:

- crop
- rotate
- retake
- flash
- preview

---

# 13. IMAGE PROCESSING

Before OCR:

1. Detect orientation.
2. Correct rotation.
3. Crop unnecessary areas.
4. Improve contrast.
5. Reduce noise where practical.
6. Preserve original image for later EXIF metadata extraction.

Do not unnecessarily destroy image metadata before attempting GPS extraction.

---

# 14. OCR ARCHITECTURE

## iOS

Primary:

Apple Vision text recognition.

OCR result must preserve:

- recognized text
- bounding boxes
- confidence
- text blocks
- line relationships

Conceptual output:

```ts
type OCRBlock = {
  text: string;
  confidence?: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};
```

---

## Android

Primary:

Google ML Kit Text Recognition.

Return the same normalized `OCRDocument` structure.

The rest of the application must not care which OCR engine produced it.

---

# 15. OCR ABSTRACTION

Create:

```ts
interface OCRProvider {
  recognize(imageUri: string): Promise<OCRDocument>;
}
```

Implement:

```text
IOSVisionOCRProvider
AndroidMLKitOCRProvider
```

The application should use:

```ts
OCRService
```

rather than directly calling platform-specific OCR code from screens.

---

# 16. LOCAL AI TIMETABLE PARSER

This is the central intelligence of SalahSync.

OCR should NOT directly become prayer data.

The pipeline is:

```text
OCR
 ↓
OCRDocument
 ↓
Local AI Parser
 ↓
Structured JSON
 ↓
Schema Validation
 ↓
Prayer Validation
```

The local AI model must run on-device.

Do not require a cloud LLM for normal operation.

---

# 17. LOCAL AI REQUIREMENTS

The AI must understand:

- multiple languages
- different prayer-name spellings
- Arabic script
- Latin script
- Indian languages
- different timetable layouts
- monthly tables
- daily tables
- Ramadan schedules
- Jumu'ah schedules where applicable

The model does not need to be a general-purpose conversational AI.

Prefer a small specialized model capable of:

```text
OCR + Layout
      ↓
Timetable Structure
      ↓
Normalized JSON
```

---

# 18. LOCAL AI PROVIDER ABSTRACTION

Create:

```ts
interface LocalAIProvider {
  parseTimetable(
    document: OCRDocument
  ): Promise<ParsedTimetable>;
}
```

Potential implementations:

```text
IOSCoreMLProvider
AndroidLocalModelProvider
FallbackParserProvider
```

The model selection must be independent of UI.

---

# 19. APPLE INTELLIGENCE REQUIREMENT

Apple Intelligence MUST NOT be required.

The primary iOS pipeline must work on an iPhone 13.

Therefore:

```text
iPhone 13
 ↓
Vision OCR
 ↓
SalahSync local parser / Core ML
 ↓
JSON
```

Apple Intelligence, when available on newer devices, may be used in the future as an optional enhancement.

It must never be a hard dependency.

---

# 20. ANDROID AI REQUIREMENT

Android must not depend on Samsung Galaxy AI.

Use:

```text
Google ML Kit
+
SalahSync local model/parser
```

Optionally use:

- LiteRT
- ONNX Runtime
- Android hardware acceleration

when available.

The application must still function on Android devices without manufacturer-specific AI features.

---

# 21. JSON SCHEMA

The local AI must produce a strict normalized schema.

Example:

```json
{
  "mosque": {
    "name": "Masjid Al Noor"
  },
  "schedule": {
    "type": "monthly",
    "month": 10,
    "year": 2026
  },
  "language": "en",
  "entries": [
    {
      "date": "2026-10-01",
      "fajr": "04:31",
      "sunrise": "05:48",
      "dhuhr": "12:15",
      "asr": "15:42",
      "maghrib": "18:28",
      "isha": "19:48"
    }
  ],
  "confidence": {
    "overall": 0.96
  },
  "warnings": []
}
```

All times must use 24-hour `HH:mm`.

Missing values must be:

```json
null
```

Never invent missing prayer times.

---

# 22. PRAYER NAME NORMALIZATION

Normalize different names into:

```text
fajr
dhuhr
asr
maghrib
isha
```

Common aliases must be supported.

Examples:

```text
Fajr
Subuh
Fajar
الفجر
فجر
```

→

```text
fajr
```

Similarly:

```text
Dhuhr
Zuhr
Zuhur
ظهر
الظهر
```

→

```text
dhuhr
```

The alias system must be extensible.

---

# 23. TIME EXTRACTION

Recognize formats including:

```text
04:31
4:31
04.31
4.31
04 31
```

Support 12-hour formats where AM/PM is present.

Do not guess AM/PM when the source is ambiguous.

Use timetable context and neighboring values only to flag ambiguity for review.

---

# 24. TABLE/LAYOUT UNDERSTANDING

The parser must use OCR coordinates.

Example:

```text
Fajr       Dhuhr       Asr
04:31      12:15       15:42
```

The system should associate each time with the correct prayer based on:

- x/y coordinates
- rows
- columns
- proximity
- table structure

Do not rely only on OCR text order.

---

# 25. MONTHLY TIMETABLE

Support tables such as:

```text
Date | Fajr | Sunrise | Dhuhr | Asr | Maghrib | Isha

01
02
03
...
30
31
```

Convert every row into a separate `PrayerDay`.

---

# 26. DAILY TIMETABLE

Support:

```text
Fajr 04:31
Dhuhr 12:15
Asr 15:42
Maghrib 18:28
Isha 19:48
```

Convert to the appropriate date using:

1. Timetable date
2. Image metadata date
3. User-selected date
4. Review screen

Never silently assume an unknown date.

---

# 27. VALIDATION ENGINE

AI output must be validated before being saved.

Validate:

- valid JSON
- valid dates
- valid times
- prayer names
- duplicate entries
- impossible times
- missing values
- timetable period

Check chronological consistency where appropriate:

```text
Fajr
<
Sunrise
<
Dhuhr
<
Asr
<
Maghrib
<
Isha
```

Do not automatically modify values to make them fit.

If suspicious:

```text
⚠️ Please verify this time.
```

---

# 28. CONFIDENCE SYSTEM

Each extracted value should ideally have a confidence score.

Example:

```json
{
  "asr": {
    "value": "15:42",
    "confidence": 0.94
  }
}
```

High confidence:

```text
≥ 0.90
```

Medium:

```text
0.70–0.89
```

Low:

```text
< 0.70
```

Low-confidence values must be highlighted in the review UI.

---

# 29. REVIEW SCREEN

Never automatically schedule prayer notifications from an uncertain timetable.

Show:

```text
Masjid Al Noor

October 2026

Fajr       04:31 ✓
Dhuhr      12:15 ✓
Asr        15:42 ✓
Maghrib    18:28 ✓
Isha       19:48 ✓
```

For uncertainty:

```text
Asr        15:42 ⚠
```

Allow the user to edit.

Button:

```text
Save Timetable
```

---

# 30. GPS & MOSQUE IDENTIFICATION

The application may use:

### Source 1

Image EXIF GPS metadata.

### Source 2

Current device GPS.

### Source 3

Mosque name extracted from OCR.

### Source 4

Web/map search.

Priority:

```text
Image GPS
 ↓
Current GPS
 ↓
OCR Mosque Name
 ↓
Nearby Mosque Search
 ↓
Name + Distance Matching
```

---

# 31. IMAGE GPS

When an image is captured/imported:

Attempt to read EXIF metadata.

If GPS exists:

```text
latitude
longitude
```

use it for mosque matching.

If GPS doesn't exist, use the device's current location after user permission.

Do not assume that an image without GPS was taken at the user's current location.

---

# 32. MOSQUE SEARCH

For v1, no custom backend is required.

Use a suitable public or approved map/geocoding service from the device.

Possible source:

OpenStreetMap/Nominatim or another appropriate provider.

Respect:

- rate limits
- attribution
- API usage policies
- privacy requirements

Do not scrape websites.

---

# 33. MOSQUE MATCHING

Candidate scoring:

```text
Distance
+
Name similarity
+
Address similarity
+
OCR mosque name
```

Example:

```text
Masjid Al Noor
120m
96% match
```

If confidence is high:

```text
Use this mosque?
```

If low:

show nearby candidates.

---

# 34. MY MOSQUES

Each saved mosque should contain:

- name
- address
- coordinates
- timezone
- created date
- last updated date
- current timetable
- timetable history
- preferred status

Example:

```text
My Mosques

Masjid Al Noor
Home

Masjid Bilal
Work

Masjid Umar
Travel
```

---

# 35. AUTOMATIC MOSQUE UPDATE

When a new image is scanned:

```text
Extract GPS
 ↓
Compare against My Mosques
 ↓
Existing mosque within threshold?
 ↓
YES
 ↓
Compare timetable period
 ↓
Newer timetable?
 ↓
YES
 ↓
Update timetable
 ↓
Reschedule notifications
```

Use a reasonable distance threshold.

Do not update a mosque solely because it is geographically nearby if the mosque name strongly contradicts it.

---

# 36. TIMETABLE HISTORY

Never immediately destroy old timetable data.

Store previous versions.

Example:

```text
Masjid Al Noor

October 2026
September 2026
August 2026
```

This allows recovery if the user scans an incorrect timetable.

---

# 37. NOTIFICATION SYSTEM

The app should schedule local prayer notifications.

Prayer types:

- Fajr
- Dhuhr
- Asr
- Maghrib
- Isha

Optional:

- Sunrise
- Jumu'ah
- Custom reminder

---

# 38. ADHAN

Allow users to choose:

- Adhan
- Short notification
- Silent
- Vibration

Fajr may have a separate audio preference.

Store approved audio files locally.

Do not download copyrighted Adhan recordings without appropriate rights.

---

# 39. NATIVE NOTIFICATION REQUIREMENTS

Android and iOS have different notification constraints.

Implement platform-specific notification scheduling where required.

The app must clearly explain notification permissions.

Do not claim guaranteed playback when the operating system does not guarantee it.

---

# 40. LOCAL DATABASE

Use Expo SQLite.

Recommended entities:

### Mosque

```text
id
name
address
latitude
longitude
timezone
createdAt
updatedAt
isPreferred
```

### Timetable

```text
id
mosqueId
month
year
scheduleType
language
source
createdAt
```

### PrayerDay

```text
id
timetableId
date
fajr
sunrise
dhuhr
asr
maghrib
isha
```

### Scan

```text
id
mosqueId
imageUri
capturedAt
latitude
longitude
processingStatus
```

### Settings

```text
theme
language
adhan
notificationPreferences
```

---

# 41. OFFLINE-FIRST PRINCIPLE

The core application must function without internet after installation.

Offline functionality:

- scanner
- OCR
- local AI
- timetable parsing
- timetable review
- local database
- saved mosques
- prayer schedule
- notifications
- Adhan audio

Internet functionality:

- mosque search
- map information
- geocoding
- future cloud functionality

Never make the user dependent on a server for their already-saved prayer timetable.

---

# 42. NO BACKEND FOR V1

Do NOT create:

- Node.js backend
- Firebase
- Supabase
- PostgreSQL
- user accounts
- cloud synchronization

for the initial version.

The architecture should remain extensible for a future backend, but v1 is local-first.

---

# 43. PRIVACY

Default principle:

> Process as much as possible on the device.

Do not upload:

- timetable images
- GPS
- OCR text
- mosque history

unless required by an explicitly user-approved online feature.

---

# 44. PERMISSIONS

Request permissions contextually.

Camera:

Explain why it is needed.

Location:

Explain that it helps identify the mosque.

Notifications:

Explain that they are required for prayer reminders.

Avoid requesting every permission immediately on first launch.

---

# 45. ERROR STATES

Handle:

- camera denied
- location denied
- notification denied
- OCR failure
- unreadable image
- unsupported timetable
- no mosque found
- ambiguous mosque
- low AI confidence
- invalid timetable
- notification scheduling failure
- insufficient storage

Every error should have a clear recovery action.

---

# 46. ACCESSIBILITY

Support:

- Dynamic Type / scalable text
- screen readers
- sufficient contrast
- minimum touch target sizes
- reduced motion
- clear semantic labels

Prayer times must be extremely readable.

---

# 47. PERFORMANCE

Target:

App launch:

<2 seconds where practical.

OCR:

<5 seconds for normal timetable.

Local AI:

as fast as device permits.

Database operations:

near-instant.

Do not block the UI thread with heavy processing.

Show progress during scanning.

---

# 48. BATTERY

Avoid:

- continuous GPS
- continuous background AI
- unnecessary background processing

GPS should normally be requested only when identifying/updating a mosque.

---

# 49. SECURITY

Use secure storage where sensitive settings eventually require it.

Do not store unnecessary personal information.

Validate all data before database insertion.

Treat OCR and AI output as untrusted input.

---

# 50. UI SCREENS

Required v1 screens:

1. Splash
2. Onboarding
3. Permission explanation
4. Home
5. Scanner
6. Image Preview
7. Processing
8. Timetable Review
9. Mosque Match
10. My Mosques
11. Mosque Detail
12. Timetable Detail
13. Prayer Calendar
14. Notification Settings
15. Adhan Settings
16. General Settings
17. Scan History
18. About / Privacy

---

# 51. NAVIGATION

Recommended:

```text
Home
Mosques
Scan
History
Settings
```

The Scan action should be prominent.

On iOS, use native tab/navigation conventions.

On Android, use Material navigation conventions.

---

# 52. HOME UX

The user should understand the app immediately.

Primary information:

```text
Current Mosque

Next Prayer

Countdown

Today's Prayer Times
```

Primary action:

```text
Scan New Timetable
```

---

# 53. MOSQUE DETAIL

Show:

```text
Masjid Al Noor

[Map]

Distance

Current Timetable

October 2026

Last Updated:
October 1, 2026
```

Actions:

- View timetable
- Scan update
- Edit mosque
- Remove mosque
- Make preferred

---

# 54. SCAN PROCESSING UX

Show meaningful stages:

```text
Preparing image
✓

Reading timetable
✓

Understanding prayer times
✓

Identifying mosque
...

Validating timetable
...
```

Do not display fake progress.

Progress must correspond to actual operations.

---

# 55. NO FAKE AI

During development, do not create fake AI responses merely to make the UI appear functional.

If a capability is not implemented:

- show an explicit development placeholder
- document the missing native integration
- do not silently return fabricated timetable data

---

# 56. TESTING STRATEGY

Test on:

### iOS

Minimum:

**iPhone 13**

Also test later on:

- newer iPhone with Apple Intelligence
- older supported iPhone where practical

### Android

Test:

- Samsung
- Pixel
- one mid-range Android device

The application must not assume manufacturer AI features exist.

---

# 57. OCR TEST DATASET

Create a local development dataset containing:

- English timetable
- Arabic timetable
- Tamil timetable
- Urdu timetable
- Hindi timetable
- Malayalam timetable
- mixed-language timetable
- monthly timetable
- daily timetable
- blurry timetable
- rotated timetable
- low-light timetable
- different fonts
- different table layouts

Do not upload this dataset to any service without appropriate rights.

---

# 58. AI TESTING

For every test image compare:

```text
Expected JSON
vs
Generated JSON
```

Measure:

- mosque-name accuracy
- prayer-name accuracy
- time accuracy
- date accuracy
- table-row accuracy

A wrong prayer time is more serious than a cosmetic OCR error.

---

# 59. DEVELOPMENT PHASES

## Phase 1 — Foundation

- Expo project
- TypeScript
- NativeWind
- Expo Router
- Zustand
- SQLite
- theme system
- platform-specific UI architecture

---

## Phase 2 — Scanner

- Camera
- Gallery
- Image preview
- Crop
- Rotation
- EXIF preservation

---

## Phase 3 — OCR

iOS:

Vision

Android:

ML Kit

Normalize into common OCRDocument.

---

## Phase 4 — Local AI

- AI provider interface
- local model integration
- JSON schema
- parser
- validation
- confidence

---

## Phase 5 — Mosque

- GPS
- EXIF GPS
- mosque search
- matching
- My Mosques

---

## Phase 6 — Timetable Management

- SQLite
- history
- automatic updates
- versioning

---

## Phase 7 — Prayer Notifications

- local scheduling
- Adhan
- settings
- permission handling

---

## Phase 8 — Polish

- accessibility
- animations
- error states
- performance
- dark mode
- onboarding
- testing

---

# 60. V1 DEFINITION OF DONE

SalahSync v1 is complete when a user can:

1. Install the application.
2. Grant camera/location/notification permissions.
3. Photograph a real mosque timetable.
4. OCR the timetable on-device.
5. Parse it using local intelligence.
6. Generate valid structured JSON.
7. Review and correct the extracted values.
8. Identify the mosque using GPS/name/search.
9. Save the mosque.
10. Save the timetable locally.
11. Schedule prayer reminders.
12. Scan a later timetable from the same mosque.
13. Automatically recognize the existing mosque.
14. Update its timetable.
15. Reschedule the notifications.
16. Continue using saved data without internet.

---

# 61. FUTURE FEATURES — NOT V1

Do not implement these during the MVP unless specifically requested:

- user accounts
- cloud sync
- mosque admin accounts
- mosque verification
- community timetable sharing
- subscriptions
- payments
- social features
- cloud AI
- advertising
- public mosque directory
- automatic cloud timetable scraping

These can be added later without changing the core architecture.

---

# 62. LONG-TERM VISION

SalahSync can eventually become a global mosque timetable platform.

Potential future capabilities:

- verified mosque profiles
- official timetable publishing
- mosque QR codes
- Ramadan timetables
- Jumu'ah schedules
- Eid prayer schedules
- community announcements
- family synchronization
- Apple Watch
- Wear OS
- cloud backup
- mosque administration portal

The v1 architecture must not prematurely implement these systems.

---

# 63. ENGINEERING PRINCIPLES

Claude Code must follow these principles:

1. **Local-first**
2. **Privacy-first**
3. **Offline-first**
4. **Strict TypeScript**
5. **Platform-native UX**
6. **No unnecessary dependencies**
7. **No backend in v1**
8. **No mandatory cloud AI**
9. **No Apple Intelligence dependency**
10. **No Samsung AI dependency**
11. **No fabricated AI output**
12. **Validate all prayer data**
13. **Keep domain logic independent of UI**
14. **Use native APIs where they provide a meaningful advantage**
15. **Prefer simple reliable engineering over unnecessary complexity**

---

# 64. IMPORTANT CLAUDE CODE INSTRUCTION

Do not attempt to build the entire application in one step.

Build incrementally.

Recommended order:

```text
1. Project foundation
2. Design system
3. Navigation
4. Home UI
5. Scanner UI
6. Database
7. iOS OCR
8. Android OCR
9. OCR abstraction
10. Local parser
11. Local AI
12. Validation
13. GPS
14. Mosque matching
15. Timetable storage
16. Notifications
17. Adhan
18. Testing
19. Performance
20. Production builds
```

After each major phase:

- run TypeScript checks
- run lint
- run tests
- build the app
- test on the physical device where applicable
- fix errors before proceeding

Do not rewrite working modules unnecessarily.

---

# 65. FIRST DEVELOPMENT TARGET

The first milestone is NOT the complete application.

Build this first:

```text
Launch
 ↓
Home
 ↓
Scan
 ↓
Camera
 ↓
Capture
 ↓
OCR
 ↓
Show OCR result
```

Once this works reliably on the **iPhone 13**, implement the Android ML Kit equivalent.

Then build the local AI JSON pipeline.

---

# 66. PRODUCT QUALITY PRINCIPLE

SalahSync deals with prayer times.

Accuracy and trust are more important than flashy AI.

The application must:

> **Never invent a prayer time when the source is unclear.**

When uncertain, ask the user to verify.

The final authority for the timetable remains the timetable provided by the mosque/user, not an AI-generated guess.

---

# 67. BRAND

Product name:

**SalahSync**

Tagline:

**Scan Once. Pray on Time.**

Brand personality:

- trustworthy
- calm
- respectful
- modern
- minimal
- privacy-conscious
- useful

Avoid excessive religious decoration in the interface.

The product should feel like a high-quality modern mobile application that happens to solve a meaningful Islamic use case.

---

# 68. FINAL ARCHITECTURE

```text
                         SALAHSYNC
                             │
                    React Native + Expo
                             │
               ┌─────────────┴─────────────┐
               │                           │
             iOS                        Android
               │                           │
       Apple Vision OCR              Google ML Kit
               │                           │
               └─────────────┬─────────────┘
                             │
                    Common OCRDocument
                             │
                             ▼
                    SalahSync AI Engine
                             │
               ┌─────────────┴─────────────┐
               │                           │
        Local AI Model               Rule/Parser Engine
               │                           │
               └─────────────┬─────────────┘
                             │
                             ▼
                    Structured JSON
                             │
                             ▼
                     Validation Engine
                             │
                             ▼
                      Review Screen
                             │
                             ▼
                       SQLite Local DB
                             │
               ┌─────────────┴─────────────┐
               │                           │
           Mosque Data               Prayer Timetable
               │                           │
               └─────────────┬─────────────┘
                             │
                             ▼
                    Local Notifications
                             │
                             ▼
                           Adhan
```

**This specification is the source of truth for the initial SalahSync implementation.** If a later implementation decision conflicts with this document, preserve the core principles—local-first processing, cross-device compatibility, accurate timetable extraction, privacy, and no dependency on manufacturer-specific AI.