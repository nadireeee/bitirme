# CodeMentor AI Backend

NestJS backend API for CodeMentor AI learning platform.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access
- 📝 **Quiz System** - Complete quiz management with categories, questions, and results
- 👥 **User Management** - User profiles, statistics, and progress tracking
- 🏆 **Achievements** - Gamification system with badges and leaderboards
- 📚 **Courses** - Course management and enrollment system
- 💬 **Forum** - Community discussion platform
- 🤖 **AI Chat** - AI-powered assistant for learning support
- 📊 **Analytics** - Detailed user progress and performance tracking

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Cache**: Redis
- **Containerization**: Docker

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (if running locally)

### Development Setup

1. **Clone and setup**

   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker**

   ```bash
   docker-compose up -d
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate

   # Seed database
   npm run prisma:seed
   ```

5. **Start Development Server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`

### API Documentation

Swagger documentation is available at:

- **Development**: http://localhost:3000/api/docs
- **Database Admin**: http://localhost:8080 (Adminer)

## Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # User management
├── quiz/           # Quiz system
├── courses/        # Course management
├── forum/          # Community forum
├── ai/             # AI chat system
├── achievements/   # Gamification
├── prisma/         # Database service
└── main.ts         # Application entry point
```

## API Endpoints

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

### Courses

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course

### Forum

- `GET /api/forum/categories` - Get forum categories
- `GET /api/forum/posts` - Get forum posts
- `POST /api/forum/posts` - Create new post

### AI Chat

- `GET /api/ai/sessions` - Get chat sessions
- `POST /api/ai/sessions` - Create new session
- `POST /api/ai/sessions/:id/messages` - Send message

## Database Schema

The application uses PostgreSQL with the following main entities:

- **Users** - User accounts and authentication
- **UserProfiles** - Extended user information and preferences
- **QuizCategories** - Quiz topic categories
- **QuizQuestions** - Individual quiz questions
- **QuizResults** - User quiz submissions and scores
- **Achievements** - Available achievements
- **UserAchievements** - User-earned achievements
- **Courses** - Learning courses
- **CourseEnrollments** - User course enrollments
- **ForumPosts** - Community forum posts
- **AiChatSessions** - AI chat conversations

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/codementor_ai"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000
REDIS_URL="redis://localhost:6379"
OPENAI_API_KEY="your-openai-key"
```

## Development Commands

```bash
# Development
npm run start:dev       # Start with hot reload
npm run start:debug     # Start with debug mode

# Build
npm run build          # Build for production
npm run start:prod     # Start production server

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma studio
npm run prisma:seed     # Seed database
npm run prisma:reset    # Reset database

# Testing
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run test:cov       # Run tests with coverage

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

## Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build

# Access database
docker-compose exec postgres psql -U codementor -d codementor_ai
```

## Production Deployment

1. **Build Docker image**

   ```bash
   docker build -t codementor-backend .
   ```

2. **Environment setup**

   - Set production environment variables
   - Configure database connection
   - Set up Redis cache
   - Configure CORS origins

3. **Database migration**

   ```bash
   npm run prisma:migrate:deploy
   ```

4. **Start application**
   ```bash
   docker run -p 3000:3000 codementor-backend
   ```

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - API rate limiting with throttling
- **CORS Protection** - Configurable CORS origins
- **Helmet** - Security headers middleware
- **Input Validation** - Request validation with class-validator
- **SQL Injection Protection** - Prisma ORM with prepared statements

## Performance Optimizations

- **Database Indexing** - Optimized database queries
- **Caching** - Redis for frequently accessed data
- **Connection Pooling** - Efficient database connections
- **Compression** - Response compression
- **Pagination** - Paginated API responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run tests and linting
6. Submit a pull request

## License

This project is licensed under the MIT License.
