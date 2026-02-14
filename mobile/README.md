# Android Mobile App - Lab 1

## Overview
This is an Android mobile application built with Kotlin that connects to the Spring Boot backend for user authentication and profile management.

## Features

### ✅ Register Screen
- Users can create a new account with:
  - First Name (Required)
  - Last Name (Required)
  - Email (Required)
  - Password (Required, minimum 6 characters)
  - Age (Optional)
  - Gender (Optional)
  - Address (Optional)
- Validates all input fields
- Automatically logs in after successful registration
- Link to navigate to Login screen

### ✅ Login Screen
- Users can log in with:
  - Email (Required)
  - Password (Required)
- Validates input fields
- Stores authentication token securely
- Link to navigate to Register screen

### ✅ Dashboard/Profile Screen (Protected)
- Displays user profile information:
  - Full Name
  - Email
  - Age (if provided)
  - Gender (if provided)
  - Address (if provided)
- Shows cached data for offline access
- Fetches fresh data from backend on load
- Logout button to clear session

### ✅ Logout Functionality
- Clears all stored user data
- Redirects to Login screen
- Ends user session

## Technical Implementation

### Architecture
```
com.example.mobile/
├── model/              # Data models (User, RegisterRequest, LoginRequest, AuthResponse)
├── network/            # API service and Retrofit client
├── util/              # Utility classes (PreferencesManager)
├── MainActivity       # Entry point - redirects based on auth status
├── RegisterActivity   # User registration
├── LoginActivity      # User login
└── DashboardActivity  # User profile/dashboard
```

### Key Technologies
- **Kotlin** - Programming language
- **Activity** - Base class (not AppCompatActivity as requested)
- **Retrofit 2** - REST API client
- **Gson** - JSON serialization/deserialization
- **Coroutines** - Asynchronous programming
- **SharedPreferences** - Local data storage
- **Material Design** - UI components

### Backend API Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/user/me` - Get current user profile (requires Bearer token)

### Network Configuration
The app is configured to connect to the backend at:
```kotlin
http://10.0.2.2:8080/
```
**Note**: `10.0.2.2` is the special IP address for Android emulator to access host machine's `localhost`.

If you're using a physical device, change this in `RetrofitClient.kt` to your computer's IP address:
```kotlin
private const val BASE_URL = "http://YOUR_COMPUTER_IP:8080/"
```

## Setup Instructions

### Prerequisites
1. Android Studio installed
2. Spring Boot backend running on port 8080
3. JDK 8 or higher

### Running the App

#### Using Android Emulator
1. Open Android Studio
2. Open the `mobile` folder as a project
3. Wait for Gradle sync to complete
4. Make sure your Spring Boot backend is running
5. Click **Run** (or press Shift+F10)
6. Select an emulator (API 24 or higher)
7. The app will automatically redirect you to Login screen if you're not logged in

#### Using Physical Device
1. Enable Developer Options and USB Debugging on your Android device
2. Connect device via USB
3. Update the `BASE_URL` in `RetrofitClient.kt` to your computer's IP address
4. Make sure your device and computer are on the same network
5. Update the backend CORS configuration to allow your device's IP
6. Run the app from Android Studio

### Testing the App

1. **Register a new account**:
   - Launch the app
   - You'll see the Login screen
   - Click "Don't have an account? Register"
   - Fill in the registration form
   - Click "Register"
   - You'll be redirected to Dashboard

2. **Login with existing account**:
   - Launch the app
   - Enter your email and password
   - Click "Login"
   - You'll be redirected to Dashboard

3. **View Profile**:
   - After logging in, you'll see your profile information
   - The app displays cached data immediately
   - Fresh data is fetched from the backend

4. **Logout**:
   - Click the "Logout" button
   - You'll be redirected to Login screen
   - All local data will be cleared

## File Structure

### Activities
- `MainActivity.kt` - Entry point, redirects based on auth status
- `RegisterActivity.kt` - User registration
- `LoginActivity.kt` - User login
- `DashboardActivity.kt` - User profile/dashboard

### Layouts
- `activity_register.xml` - Registration form UI
- `activity_login.xml` - Login form UI
- `activity_dashboard.xml` - Dashboard/profile UI

### Models
- `User.kt` - User data model with all request/response DTOs

### Network
- `ApiService.kt` - Retrofit API interface
- `RetrofitClient.kt` - Retrofit singleton instance

### Utils
- `PreferencesManager.kt` - SharedPreferences wrapper for secure data storage

## Security Features
- JWT token authentication
- Secure token storage using SharedPreferences
- Password validation (minimum 6 characters)
- Email validation
- Automatic token refresh on app restart
- Session expiration handling

## Design Patterns Used
- **Singleton Pattern** - RetrofitClient
- **Repository Pattern** - PreferencesManager
- **MVP Architecture** - Activity-based architecture
- **Coroutines** - Async/await pattern for network calls

## Dependencies
```gradle
// Retrofit for API calls
implementation("com.squareup.retrofit2:retrofit:2.9.0")
implementation("com.squareup.retrofit2:converter-gson:2.9.0")
implementation("com.squareup.okhttp3:logging-interceptor:4.11.0")

// Coroutines
implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")

// Lifecycle
implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.2")
```

## Important Notes
1. The app uses `Activity` base class instead of `AppCompatActivity` as requested
2. All network calls are made using Kotlin Coroutines
3. User data is cached locally for offline access
4. The app handles network errors gracefully
5. HTTPS is not required for local development (using cleartext traffic)

## Troubleshooting

### Cannot connect to backend
- Make sure backend is running on port 8080
- Check the `BASE_URL` in `RetrofitClient.kt`
- For physical devices, ensure both device and computer are on same network
- Update backend CORS configuration to allow mobile app origin

### Login/Register fails
- Check backend logs for error messages
- Verify backend is accepting requests from mobile app
- Check network connectivity
- Review email/password validation rules

### App crashes on startup
- Check Gradle sync completed successfully
- Verify all dependencies are downloaded
- Check AndroidManifest.xml has all required permissions
- Review logcat for error messages

## Future Enhancements
- [ ] Remember me functionality
- [ ] Password reset
- [ ] Profile editing
- [ ] Image upload for profile picture
- [ ] Biometric authentication
- [ ] Push notifications
- [ ] Offline mode with local database

---

**Note**: This app is built for educational purposes as part of IT342 Lab 1 assignment.
