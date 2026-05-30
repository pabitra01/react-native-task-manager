# Project & Task Manager App

A full-stack mobile application for managing projects and tasks, built with React Native CLI and Node.js/Express.

## Tech Stack

- **Frontend**: React Native CLI (0.85.3) with Redux Toolkit
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (via Sequelize ORM)
- **Authentication**: OTP-based with JWT

## Project Structure

```
├── backend/          # Node.js/Express REST API
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth & error handling
│   │   ├── models/        # Sequelize models
│   │   ├── routes/        # Express routes
│   │   ├── services/      # Business logic (OTP)
│   │   └── utils/         # Validators
│   └── .env.example
│
└── TaskManager/      # React Native mobile app
    ├── src/
    │   ├── api/           # Axios client
    │   ├── components/    # Reusable UI components
    │   ├── navigation/    # App navigator
    │   ├── screens/       # Screen components
    │   ├── store/         # Redux store & slices
    │   ├── theme/         # Light/Dark theme
    │   └── utils/         # AsyncStorage helpers
    ├── android/
    └── ios/
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL
- React Native development environment set up ([React Native Docs](https://reactnative.dev/docs/environment-setup))
- Xcode (for iOS) / Android Studio (for Android)

### 1. Setup Database

```bash
# Create PostgreSQL database
createdb task_manager
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env    # Update with your DB credentials
npm install
npm run dev             # Starts on port 5000
```

### 3. Setup Mobile App

```bash
cd TaskManager
npm install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register (email + name) |
| POST | `/api/auth/login` | Login (sends OTP) |
| POST | `/api/auth/verify-otp` | Verify OTP → JWT |
| GET | `/api/auth/me` | Get profile (auth required) |

### Projects (auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Tasks (auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/:projectId/tasks` | List tasks |
| POST | `/api/projects/:projectId/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Features

- ✅ OTP-based authentication with JWT
- ✅ Project CRUD (Create, Read, Update, Delete)
- ✅ Task CRUD with status toggle (pending/completed)
- ✅ Redux Toolkit state management with async thunks
- ✅ Light/Dark mode with persistence
- ✅ Search/filter projects
- ✅ Task filtering (All/Pending/Completed)
- ✅ Pull-to-refresh on all lists
- ✅ Animated checkbox toggles & card press effects
- ✅ Loading indicators & empty states
- ✅ Input validation (frontend + backend)
- ✅ JWT middleware with 401 auto-logout

## Development Notes

- **OTP in Dev Mode**: The OTP is printed to the backend console (`🔑 [DEV] Generated OTP: XXXXXX`). No email service needed for testing.
- **API Base URL**: Configured automatically per platform — `10.0.2.2:5000` for Android emulator, `localhost:5000` for iOS.
