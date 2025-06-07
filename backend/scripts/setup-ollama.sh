#!/bin/bash

# Ollama + Mistral Setup Script for CodeMentor AI

echo "🤖 Setting up Ollama + Mistral for CodeMentor AI..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start Ollama service
echo "🚀 Starting Ollama service..."
docker-compose up -d ollama

# Wait for Ollama to be ready
echo "⏳ Waiting for Ollama to be ready..."
sleep 10

# Function to check if Ollama is responding
check_ollama() {
    curl -s http://localhost:11434/api/tags > /dev/null 2>&1
    return $?
}

# Wait for Ollama to be ready
max_attempts=30
attempt=1
while ! check_ollama; do
    if [ $attempt -ge $max_attempts ]; then
        echo "❌ Ollama failed to start after $max_attempts attempts"
        exit 1
    fi
    echo "⏳ Attempt $attempt/$max_attempts: Waiting for Ollama..."
    sleep 5
    ((attempt++))
done

echo "✅ Ollama is ready!"

# Pull Mistral model
echo "📥 Downloading Mistral model (this may take a few minutes)..."
docker exec codementor_ollama ollama pull mistral

# Verify the model is available
echo "🔍 Verifying Mistral model..."
if docker exec codementor_ollama ollama list | grep -q mistral; then
    echo "✅ Mistral model downloaded successfully!"
else
    echo "❌ Failed to download Mistral model"
    exit 1
fi

# Test the model with a simple query
echo "🧪 Testing Mistral model..."
test_response=$(docker exec codementor_ollama ollama run mistral "What is C++?" --verbose=false 2>/dev/null | head -n 3)

if [ -n "$test_response" ]; then
    echo "✅ Mistral model is working correctly!"
    echo "📝 Test response: $test_response"
else
    echo "⚠️  Mistral model may not be working properly, but it's installed"
fi

# Display model information
echo ""
echo "📊 Ollama Model Information:"
docker exec codementor_ollama ollama list

echo ""
echo "🎉 Ollama + Mistral setup completed!"
echo ""
echo "🔗 Available endpoints:"
echo "   - Ollama API: http://localhost:11434"
echo "   - Ollama Web UI: http://localhost:8081 (if enabled)"
echo ""
echo "💡 Usage in backend:"
echo "   - OLLAMA_URL: http://localhost:11434"
echo "   - OLLAMA_MODEL: mistral"
echo ""
echo "🚀 You can now start the backend with AI capabilities!"

# Optional: Start the web UI
read -p "🌐 Do you want to start Ollama Web UI for easy model management? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌐 Starting Ollama Web UI..."
    docker-compose up -d ollama-webui
    echo "✅ Ollama Web UI started at http://localhost:8081"
fi

echo ""
echo "📚 Next steps:"
echo "1. Start the backend: npm run start:dev"
echo "2. The AI features will automatically use Mistral"
echo "3. Test AI endpoints in Swagger: http://localhost:3000/api/docs"
