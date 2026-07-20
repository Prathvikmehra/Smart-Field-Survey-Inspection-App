# 📋 Smart Field Survey & Inspection App

A **React Native** mobile application built with **Expo SDK 54** and **Expo Router** for conducting field surveys and site inspections. The app provides a complete workflow for creating, managing, and reviewing survey data — including GPS location capture, camera integration, clipboard utilities, and device contacts access.

> **Developer:** Prathvik Mehra  
> **Enrollment:** 23CS001  
> **Version:** 1.0.0

---

## ✨ Features

### Core Survey Workflow
- **Create & Edit Surveys** — Form with site name, client name, description, priority, location, and photo attachment
- **Survey Preview** — Detailed read-only view of any survey with edit and delete options
- **Survey History** — Searchable, filterable list of all surveys with priority-based color coding
- **Local Persistence** — All data is saved to `AsyncStorage` and persists between app launches

### Device API Integration
- **📷 Camera** — Capture site photos using `expo-camera`, save to gallery, or attach directly to a survey
- **📍 Location** — Fetch GPS coordinates via `expo-location` with accuracy display and clipboard copy
- **📇 Contacts** — Browse and search device contacts via `expo-contacts`, copy contact info to clipboard
- **📋 Clipboard** — View current clipboard content and copy sample survey data for testing

### User Experience
- **🌗 Dark Mode** — Toggle between light and dark themes; preference persists via AsyncStorage
- **👤 Profile Management** — Edit name, enrollment number, and profile photo (from camera or gallery)
- **⚙️ Settings** — Theme toggle, data management (clear all surveys), version info, support links
- **🎨 Drawer Navigation** — Side menu with profile header, all screen links, and active state highlighting

---

## 🏗️ Project Structure

```
assigment/
├── app/                          # File-based routing (Expo Router)
│   ├── _layout.tsx               # Root layout — wraps app in providers (Theme, Survey, Profile)
│   ├── preview.jsx               # Survey detail/preview modal screen
│   └── (drawer)/                 # Drawer navigator group
│       ├── _layout.tsx           # Drawer configuration & custom drawer content
│       ├── index.jsx             # Dashboard — greeting, stats, quick actions, recent surveys
│       ├── survey.jsx            # Create / Edit survey form
│       ├── camera.jsx            # Camera capture with preview, save, retake, delete
│       ├── history.jsx           # Survey history with search & priority filters
│       ├── profile.jsx           # User profile editor with photo picker
│       ├── contacts.jsx          # Device contacts browser with search & copy
│       ├── location.jsx          # GPS coordinate viewer with refresh & copy
│       ├── clipboard.jsx         # Clipboard viewer with quick-copy test buttons
│       └── settings.jsx          # App settings, theme toggle, data management
│
├── components/                   # Reusable UI components
│   ├── AppHeader.jsx             # Consistent top header bar with hamburger menu
│   ├── QuickActionCard.jsx       # Dashboard quick action grid cards
│   └── SurveySummaryCard.jsx     # Survey summary card for recent surveys list
│
├── context/                      # React Context providers for global state
│   ├── ThemeContext.jsx           # Light/dark theme with AsyncStorage persistence
│   ├── SurveyContext.jsx          # Survey CRUD operations + pending photo state
│   └── ProfileContext.jsx         # User profile data with AsyncStorage persistence
│
├── assets/                       # Static assets (icons, splash screen images)
├── constants/                    # App constants
├── hooks/                        # Custom React hooks
├── app.json                      # Expo configuration
├── package.json                  # Dependencies & scripts
└── tsconfig.json                 # TypeScript configuration
```

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React Native 0.81 + Expo SDK 54 |
| **Navigation** | Expo Router 6 (file-based) + Drawer Navigator |
| **State Management** | React Context API |
| **Local Storage** | AsyncStorage (with in-memory fallback) |
| **Camera** | expo-camera |
| **Location** | expo-location |
| **Contacts** | expo-contacts |
| **Clipboard** | expo-clipboard |
| **Image Picker** | expo-image-picker |
| **Media Library** | expo-media-library |
| **Animations** | react-native-reanimated |
| **Gestures** | react-native-gesture-handler |
| **Icons** | @expo/vector-icons (Ionicons) |
| **Language** | TypeScript + JavaScript (JSX) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- [Expo Go](https://expo.dev/go) app on your Android/iOS device (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prathvikmehra/Smart-Field-Survey-Inspection-App.git
   cd Smart-Field-Survey-Inspection-App/assigment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on a device**
   - Scan the QR code with the **Expo Go** app (Android/iOS)
   - Or press `a` for Android emulator / `i` for iOS simulator

---

## 📱 Screen-by-Screen Overview

### Dashboard (`index.jsx`)
The home screen showing a time-based greeting, total survey count, four quick-action cards (New Survey, Camera, Location, History), and the three most recent surveys.

### Create / Edit Survey (`survey.jsx`)
A multi-field form supporting both creation and editing. Fields include site name, client name, description, priority selector (High/Medium/Low), location coordinates (with paste-from-clipboard), and site photo attachment. Validates required fields before submission.

### Camera (`camera.jsx`)
Full-screen camera viewfinder using `expo-camera`. After capturing, shows a preview with Retake, Save (to gallery), Delete, and "Use Photo" (attaches to current survey draft via `SurveyContext.pendingPhoto`).

### Survey History (`history.jsx`)
A searchable `FlatList` of all surveys with a search bar (filters by ID, site name, or client name) and priority filter chips (All / High / Medium / Low). Each card links to the preview screen and has a delete button.

### Survey Preview (`preview.jsx`)
A read-only detail view showing all survey data including ID badge, site/client/date/priority, description, location coordinates, and attached photo. Footer has "Edit Survey" and "Submit" buttons.

### Profile (`profile.jsx`)
Displays and edits the user's name, enrollment number, and profile photo. Photo can be changed via camera or gallery picker. All changes persist via `ProfileContext` → `AsyncStorage`.

### Location (`location.jsx`)
Requests GPS permission, fetches the current position via `expo-location`, and displays latitude, longitude, and accuracy. Includes Refresh and Copy (to clipboard) buttons.

### Contacts (`contacts.jsx`)
Lists device contacts (name + phone number) fetched via `expo-contacts`. Includes a search bar and a copy button per contact to put `"Name: Phone"` on the clipboard. Supports pull-to-refresh.

### Clipboard (`clipboard.jsx`)
Reads and displays the current device clipboard contents using `expo-clipboard`. Includes a refresh button and two quick-copy test buttons (sample location and sample contact data).

### Settings (`settings.jsx`)
App preferences: Dark Mode toggle, total survey count, "Clear All Surveys" (with confirmation), Help & FAQ (placeholder), Contact Support (opens email), and version display.

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────┐
│                   ThemeProvider                      │
│  ┌───────────────────────────────────────────────┐  │
│  │               SurveyProvider                   │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │            ProfileProvider               │  │  │
│  │  │                                          │  │  │
│  │  │   ┌──────────┐    ┌───────────────┐     │  │  │
│  │  │   │ Dashboard │◄───│ SurveyContext  │     │  │  │
│  │  │   └──────────┘    │  - surveys[]   │     │  │  │
│  │  │                    │  - addSurvey   │     │  │  │
│  │  │   ┌──────────┐    │  - editSurvey  │     │  │  │
│  │  │   │  Survey   │◄──►│  - getSurvey   │     │  │  │
│  │  │   │   Form    │    │  - pendingPhoto│     │  │  │
│  │  │   └────┬─────┘    └───────┬───────┘     │  │  │
│  │  │        │                   │              │  │  │
│  │  │   ┌────▼─────┐    ┌──────▼──────┐       │  │  │
│  │  │   │  Camera   │───►│ AsyncStorage │       │  │  │
│  │  │   └──────────┘    └─────────────┘       │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

- **ThemeContext** — manages light/dark mode colors globally
- **SurveyContext** — CRUD for surveys + `pendingPhoto` bridge between Camera and Survey form
- **ProfileContext** — user name, enrollment, and photo
- All three contexts persist their data to **AsyncStorage** with an in-memory fallback

---

## 📄 License

This project is for educational purposes.
