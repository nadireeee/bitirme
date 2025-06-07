# Ollama + Mistral Setup Script for CodeMentor AI (PowerShell)

Write-Host "🤖 Setting up Ollama + Mistral for CodeMentor AI..." -ForegroundColor Green

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

# Start Ollama service
Write-Host "🚀 Starting Ollama service..." -ForegroundColor Yellow
docker-compose up -d ollama

# Wait for Ollama to be ready
Write-Host "⏳ Waiting for Ollama to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Function to check if Ollama is responding
function Test-OllamaReady {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

# Wait for Ollama to be ready
$maxAttempts = 30
$attempt = 1

while (-not (Test-OllamaReady)) {
    if ($attempt -ge $maxAttempts) {
        Write-Host "❌ Ollama failed to start after $maxAttempts attempts" -ForegroundColor Red
        exit 1
    }
    Write-Host "⏳ Attempt $attempt/$maxAttempts`: Waiting for Ollama..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    $attempt++
}

Write-Host "✅ Ollama is ready!" -ForegroundColor Green

# Pull Mistral model
Write-Host "📥 Downloading Mistral model (this may take a few minutes)..." -ForegroundColor Yellow
docker exec codementor_ollama ollama pull mistral

# Verify the model is available
Write-Host "🔍 Verifying Mistral model..." -ForegroundColor Yellow
$modelList = docker exec codementor_ollama ollama list
if ($modelList -match "mistral") {
    Write-Host "✅ Mistral model downloaded successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to download Mistral model" -ForegroundColor Red
    exit 1
}

# Test the model with a simple query
Write-Host "🧪 Testing Mistral model..." -ForegroundColor Yellow
try {
    $testResponse = docker exec codementor_ollama ollama run mistral "What is C++?" 2>$null | Select-Object -First 3
    if ($testResponse) {
        Write-Host "✅ Mistral model is working correctly!" -ForegroundColor Green
        Write-Host "📝 Test response: $($testResponse -join ' ')" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Mistral model may not be working properly, but it's installed" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not test Mistral model, but it's installed" -ForegroundColor Yellow
}

# Display model information
Write-Host ""
Write-Host "📊 Ollama Model Information:" -ForegroundColor Cyan
docker exec codementor_ollama ollama list

Write-Host ""
Write-Host "🎉 Ollama + Mistral setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Available endpoints:" -ForegroundColor Cyan
Write-Host "   - Ollama API: http://localhost:11434"
Write-Host "   - Ollama Web UI: http://localhost:8081 (if enabled)"
Write-Host ""
Write-Host "💡 Usage in backend:" -ForegroundColor Cyan
Write-Host "   - OLLAMA_URL: http://localhost:11434"
Write-Host "   - OLLAMA_MODEL: mistral"
Write-Host ""
Write-Host "🚀 You can now start the backend with AI capabilities!" -ForegroundColor Green

# Optional: Start the web UI
$startWebUI = Read-Host "🌐 Do you want to start Ollama Web UI for easy model management? (y/n)"
if ($startWebUI -eq "y" -or $startWebUI -eq "Y") {
    Write-Host "🌐 Starting Ollama Web UI..." -ForegroundColor Yellow
    docker-compose up -d ollama-webui
    Write-Host "✅ Ollama Web UI started at http://localhost:8081" -ForegroundColor Green
}

Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start the backend: npm run start:dev"
Write-Host "2. The AI features will automatically use Mistral"
Write-Host "3. Test AI endpoints in Swagger: http://localhost:3000/api/docs"
