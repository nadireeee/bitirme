#!/bin/bash

# CodeMentor AI Backend Startup Script

echo "🚀 Starting CodeMentor AI Backend..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before continuing."
    echo "🔧 You can edit it with: nano .env"
    exit 1
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec postgres pg_isready -U codementor -d codementor_ai; do
    echo "⏳ PostgreSQL is not ready yet. Waiting..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run prisma:generate

# Run database migrations
echo "🗃️  Running database migrations..."
npm run prisma:migrate

# Seed the database
echo "🌱 Seeding database with initial data..."
npm run prisma:seed

# Start the backend server
echo "🚀 Starting backend server..."
npm run start:dev

echo "✅ Backend is running!"
echo "📚 API Documentation: http://localhost:3000/api/docs"
echo "🗄️  Database Admin: http://localhost:8080"
echo "📋 Default login:"
echo "   Email: admin@codementor.ai"
echo "   Password: admin123"
