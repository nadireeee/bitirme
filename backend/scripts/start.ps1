# CodeMentor AI Backend Startup Script (PowerShell)

Write-Host "🚀 Starting CodeMentor AI Backend..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info *>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not running"
    }
} catch {
    Write-Host "❌ Docker is not running. Please start Docker first." -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "⚠️  Please edit .env file with your configuration before continuing." -ForegroundColor Yellow
        Write-Host "🔧 You can edit it with: notepad .env" -ForegroundColor Cyan
        exit 1
    } else {
        Write-Host "❌ .env.example file not found. Please create .env file manually." -ForegroundColor Red
        exit 1
    }
}

# Start Docker services
Write-Host "🐳 Starting Docker services..." -ForegroundColor Yellow
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
$pgReady = $false
$attempts = 0
$maxAttempts = 30

while (-not $pgReady -and $attempts -lt $maxAttempts) {
    try {
        docker-compose exec postgres pg_isready -U codementor -d codementor_ai *>$null
        if ($LASTEXITCODE -eq 0) {
            $pgReady = $true
        } else {
            Write-Host "⏳ PostgreSQL is not ready yet. Waiting..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2
            $attempts++
        }
    } catch {
        Write-Host "⏳ PostgreSQL is not ready yet. Waiting..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
        $attempts++
    }
}

if (-not $pgReady) {
    Write-Host "❌ PostgreSQL failed to start after $maxAttempts attempts" -ForegroundColor Red
    exit 1
}

Write-Host "✅ PostgreSQL is ready!" -ForegroundColor Green

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npm run prisma:generate

# Run database migrations
Write-Host "🗃️  Running database migrations..." -ForegroundColor Yellow
npm run prisma:migrate

# Seed the database
Write-Host "🌱 Seeding database with initial data..." -ForegroundColor Yellow
npm run prisma:seed

# Start the backend server
Write-Host "🚀 Starting backend server..." -ForegroundColor Yellow
npm run start:dev

Write-Host "✅ Backend is running!" -ForegroundColor Green
Write-Host "📚 API Documentation: http://localhost:3000/api/docs" -ForegroundColor Cyan
Write-Host "🗄️  Database Admin: http://localhost:8080" -ForegroundColor Cyan
Write-Host "📋 Default login:" -ForegroundColor Cyan
Write-Host "   Email: admin@codementor.ai"
Write-Host "   Password: admin123"
