# 🚀 CodeMentor AI - Complete Setup Guide

Complete React Native + NestJS Backend setup for CodeMentor AI learning platform.

## 📋 Prerequisites

- **Node.js** 18+
- **Docker & Docker Compose**
- **React Native development environment**:
  - Android Studio (for Android)
  - Xcode (for iOS, macOS only)
- **Expo CLI**: `npm install -g @expo/cli`

## 🏗️ Project Structure

```
codementor-ai/
├── backend/                 # NestJS Backend API
│   ├── src/                # Source code
│   ├── prisma/             # Database schema & migrations
│   ├── docker-compose.yml  # Docker services
│   └── package.json        # Backend dependencies
├── src/                    # React Native Frontend
│   ├── screens/            # App screens
│   ├── services/           # API services
│   ├── contexts/           # React contexts
│   └── data/               # Local data (now replaced by API)
└── package.json            # Frontend dependencies
```

## 🎯 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start all services with Docker
docker-compose up -d

# Wait for PostgreSQL to be ready (about 30 seconds)
# Then run database setup
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Start development server
npm run start:dev
```

**Backend will be available at:**

- 🌐 **API**: http://localhost:3000
- 📚 **Documentation**: http://localhost:3000/api/docs
- 🗄️ **Database Admin**: http://localhost:8080

### 2. Frontend Setup

```bash
# Install dependencies (from root directory)
npm install

# Start Expo development server
npm start
```

## 🔐 Default Credentials

**Admin User:**

- Email: `admin@codementor.ai`
- Password: `admin123`

**Test User:**

- Email: `user@codementor.ai`
- Password: `user123`

## 🛠️ Development Workflow

### Backend Development

```bash
cd backend

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Database operations
npm run prisma:studio        # Open database GUI
npm run prisma:migrate       # Create new migration
npm run prisma:reset         # Reset database

# Testing
npm run test                 # Unit tests
npm run test:e2e            # End-to-end tests
```

### Frontend Development

```bash
# Start development server
npm start

# Platform-specific builds
npm run android             # Android device/emulator
npm run ios                 # iOS simulator (macOS only)
npm run web                 # Web browser
```

## 🌟 Features Implemented

### ✅ Backend (NestJS)

- **🔐 Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (Student, Instructor, Admin)
  - Password hashing with bcrypt
  - Token refresh mechanism

- **📝 Quiz System**

  - Quiz categories and questions management
  - Real-time quiz submission and scoring
  - Detailed result tracking with explanations
  - User statistics and progress tracking

- **👥 User Management**

  - User profiles with customizable settings
  - Experience levels and preferences
  - Account management and deactivation

- **🏆 Achievement System**

  - Automated achievement detection
  - Gamification with points and badges
  - Leaderboard functionality

- **📚 Course Management**

  - Course creation and enrollment
  - Progress tracking
  - Multi-level course structure

- **💬 Forum System**

  - Category-based discussions
  - Post creation and commenting
  - Social interactions (likes, views)

- **🤖 AI Chat**
  - Session-based AI conversations
  - Message history persistence
  - Basic C++ programming assistance

### ✅ Frontend (React Native)

- **📱 Responsive Design**

  - Supports phones, tablets, and web
  - Adaptive layouts and typography
  - Platform-specific optimizations

- **🎯 Quiz System Integration**

  - Level-based category filtering
  - Interactive quiz-taking experience
  - Real-time results and statistics
  - Achievement tracking

- **👤 User Authentication**

  - Login and registration forms
  - Secure token management
  - Auto-refresh on app launch

- **🌍 Internationalization**
  - Turkish and English support
  - Dynamic language switching
  - Localized content

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Quiz System

- `GET /api/quiz/categories` - Get quiz categories
- `GET /api/quiz/categories/:id` - Get category with questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/results` - Get user results
- `GET /api/quiz/stats` - Get user statistics

### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics

### Achievements

- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/user` - Get user achievements
- `GET /api/achievements/leaderboard` - Get leaderboard

## 🗄️ Database Schema

**Main Tables:**

- `users` - User accounts and authentication
- `user_profiles` - Extended user information
- `quiz_categories` - Quiz topic categories
- `quiz_questions` - Individual quiz questions
- `quiz_results` - User quiz submissions
- `achievements` - Available achievements
- `user_achievements` - User-earned achievements
- `courses` - Learning courses
- `forum_posts` - Community discussions

## 🔧 Configuration

### Backend Environment Variables

```env
# Database
DATABASE_URL="postgresql://codementor:codementor123@localhost:5432/codementor_ai"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Application
NODE_ENV="development"
PORT=3000

# CORS
CORS_ORIGIN="http://localhost:3000,exp://localhost:19000"
```

### Frontend Configuration

Update `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? "http://localhost:3000/api" // Development
    : "https://your-api.com/api", // Production
};
```

## 🚨 Troubleshooting

### Backend Issues

**Database Connection Failed:**

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart services
docker-compose down && docker-compose up -d
```

**Port Already in Use:**

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Frontend Issues

**Expo Start Issues:**

```bash
# Clear Expo cache
npx expo start --clear

# Reset Metro cache
npx react-native start --reset-cache
```

**Android Build Issues:**

```bash
# Clean build
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

## 📈 Performance Optimization

### Backend

- **Database indexing** for frequently queried fields
- **Redis caching** for session management
- **Connection pooling** for database efficiency
- **Rate limiting** for API protection

### Frontend

- **Image optimization** with responsive loading
- **Lazy loading** for large lists
- **Memory management** for quiz data
- **Offline support** for quiz content

## 🚀 Deployment

### Backend Deployment

```bash
# Build production image
docker build -t codementor-backend .

# Run production container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-production-db-url" \
  -e JWT_SECRET="your-production-secret" \
  codementor-backend
```

### Frontend Deployment

```bash
# Build for production
npx expo build:android    # Android APK
npx expo build:ios        # iOS IPA
npx expo build:web        # Web build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run linting and tests
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

---

## 🎉 Next Steps

1. **Start Backend**: `cd backend && docker-compose up -d && npm run start:dev`
2. **Start Frontend**: `npm start`
3. **Open Documentation**: http://localhost:3000/api/docs
4. **Test Login**: Use default credentials in the mobile app
5. **Explore Features**: Try the quiz system, view achievements, check forum

Happy coding! 🚀
