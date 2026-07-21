# Smart Field Survey & Inspection App

A complete React Native application built with Expo for managing field surveys and site inspections. This app includes multiple modules utilizing device hardware such as Camera, Location, Contacts, and Clipboard, all tied together with a modern UI using Expo Router.

## Project Details
- **Student Name:** Prathvik Mehra
- **Enrollment Number:** 23CS001

## 📱 Modules Included

### 1. Dashboard & Navigation
- **Drawer & Tab Navigation:** Uses Expo Router with a Drawer that wraps around bottom tabs.
- **Custom Header:** Custom header with a hamburger menu for easy access.
- **Summary Cards:** Quick action cards and recent survey summaries.

### 2. Survey Creation
- Input form for Site Name, Client Name, and Description.
- Priority selector (High, Medium, Low).
- Validation to ensure required fields are filled before submission.
- Clipboard integration to easily paste location/contact info.

### 3. Camera Integration
- **Expo Camera:** Custom camera UI to capture site photos.
- **Permissions:** Handles camera permission requests gracefully.
- **Preview & Management:** Preview, retake, and delete captured photos with confirmation dialogs.

### 4. Location Services
- **Expo Location:** Fetches live GPS coordinates (latitude, longitude) and accuracy.
- Handles location permission requests.
- Easy "Copy to Clipboard" feature to export location data.

### 5. Contacts
- **Expo Contacts:** Reads device contacts and displays them in a searchable list.
- Quickly copy a client's name and phone number to the clipboard for use in the survey form.

### 6. Clipboard Manager
- **Expo Clipboard:** Dedicated screen to view currently copied text.
- Provides test buttons to simulate copying data.

### 7. Survey Preview
- A modal screen displaying full details of a created survey.
- Displays the attached site photo, location data, priority badges, and description.

### 8. Survey History
- A scrollable list of all created surveys stored in the global Context.
- **Search & Filter:** Search by Site, Client, or ID. Filter by Priority.
- Ability to delete surveys directly from the history view.

## 🛠️ Tech Stack
- **Framework:** React Native / Expo (SDK 54)
- **Routing:** Expo Router (File-based routing)
- **State Management:** React Context API
- **Styling:** React Native StyleSheet
- **Icons:** Ionicons (via `@expo/vector-icons`)
- **Native APIs:** `expo-camera`, `expo-location`, `expo-contacts`, `expo-clipboard`

## 🚀 How to Run Locally

1. Clone the repository
2. Navigate into the `assigment` directory:
   ```bash
   cd assigment
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Expo server (it is recommended to clear the cache for fresh builds):
   ```bash
   npx expo start --clear
   ```
5. Scan the QR code using the **Expo Go** app on your physical device.
