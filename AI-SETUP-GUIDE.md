# 🤖 AI Integration Setup Guide - Ollama + Mistral

Complete guide to set up AI-powered features in CodeMentor AI using Ollama and Mistral.

## 🎯 Overview

This guide will help you set up:

- **Ollama** - Local AI inference server
- **Mistral** - Powerful language model for C++ tutoring
- **AI-powered features** throughout the app

## 📋 Prerequisites

- Docker & Docker Compose installed
- At least 8GB RAM (16GB recommended)
- 10GB free disk space for models
- Basic understanding of command line

## 🚀 Quick Setup

### 1. Automated Setup (Recommended)

```bash
# Navigate to backend directory
cd backend

# Run the automated setup script
chmod +x scripts/setup-ollama.sh
./scripts/setup-ollama.sh
```

This script will:

- Start Ollama service in Docker
- Download Mistral model
- Test the integration
- Optionally start Web UI

### 2. Manual Setup

If you prefer manual setup:

```bash
# Start Ollama service
docker-compose up -d ollama

# Wait for service to be ready
sleep 30

# Pull Mistral model
docker exec codementor_ollama ollama pull mistral

# Verify installation
docker exec codementor_ollama ollama list
```

## 🔧 Configuration

### Environment Variables

Update your `.env` file:

```env
# Ollama Configuration
OLLAMA_URL="http://localhost:11434"
OLLAMA_MODEL="mistral"

# For Docker deployment
OLLAMA_URL="http://ollama:11434"
```

### Docker Services

The system includes these AI-related services:

```yaml
ollama:
  image: ollama/ollama:latest
  ports:
    - "11434:11434"
  volumes:
    - ollama_data:/root/.ollama

ollama-webui: # Optional
  image: ghcr.io/open-webui/open-webui:main
  ports:
    - "8081:8080"
```

## 🧪 Testing the Setup

### 1. Health Check

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Test model response
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral",
    "prompt": "What is C++?",
    "stream": false
  }'
```

### 2. Backend API Test

Start your backend and test AI endpoints:

```bash
# Start backend
npm run start:dev

# Test AI health endpoint
curl http://localhost:3000/api/ai/health

# Test code analysis
curl -X POST http://localhost:3000/api/ai/analyze-code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "code": "int main() { return 0; }",
    "language": "cpp"
  }'
```

## 🎨 AI Features Overview

### 1. Code Playground AI

- **Real-time code analysis**
- **Smart suggestions**
- **Bug detection**
- **Code explanation**
- **Auto-completion**

### 2. Quiz AI Assistant

- **Intelligent hints**
- **Concept explanations**
- **Solution strategies**
- **Related topics**

### 3. Smart Suggestions

- **Personalized learning paths**
- **Activity-based recommendations**
- **Difficulty adjustment**
- **Progress optimization**

### 4. AI Chat Support

- **24/7 C++ tutoring**
- **Code review**
- **Problem-solving guidance**
- **Concept clarification**

## 📱 Frontend Integration

### AI Service Usage

```typescript
import aiService from "../services/aiService";

// Analyze code
const analysis = await aiService.analyzeCode(code, "cpp");

// Get quiz help
const help = await aiService.getQuizHelp(question, userAnswer);

// Generate code
const generation = await aiService.generateCode(description);

// Explain code
const explanation = await aiService.explainCode(code);
```

### Component Examples

```tsx
// AI-powered Quiz Helper
<QuizHelper
  question={question}
  options={options}
  userAnswer={selectedAnswer}
  isVisible={showAiHelper}
  onClose={() => setShowAiHelper(false)}
/>

// Smart Suggestions
<SmartSuggestions
  userLevel="beginner"
  recentActivity={['variables', 'functions']}
  onNavigate={navigate}
/>
```

## 🔧 Performance Optimization

### 1. Model Selection

**Current: Mistral (7B parameters)**

- Good balance of performance and accuracy
- Optimized for coding tasks
- Runs well on 8GB+ RAM

**Alternative Models:**

```bash
# For better performance (smaller model)
ollama pull codellama:7b

# For better accuracy (larger model)
ollama pull mistral:8x7b  # Requires 32GB+ RAM
```

### 2. Caching Strategy

```typescript
// Backend implements response caching
// Repeated queries return faster
const cached = await aiService.analyzeCode(sameCode); // Faster
```

### 3. Request Optimization

```typescript
// Batch multiple requests
const [analysis, explanation] = await Promise.all([
  aiService.analyzeCode(code),
  aiService.explainCode(code),
]);
```

## 🚨 Troubleshooting

### Common Issues

**1. Ollama not starting**

```bash
# Check Docker logs
docker logs codementor_ollama

# Restart service
docker-compose restart ollama
```

**2. Model download fails**

```bash
# Check disk space
df -h

# Clear old models
docker exec codementor_ollama ollama rm old-model

# Retry download
docker exec codementor_ollama ollama pull mistral
```

**3. AI responses are slow**

```bash
# Check system resources
docker stats codementor_ollama

# Consider smaller model
docker exec codementor_ollama ollama pull mistral:7b
```

**4. Backend can't connect to Ollama**

```bash
# Check network connectivity
docker exec codementor_backend curl http://ollama:11434/api/tags

# Verify environment variables
docker exec codementor_backend env | grep OLLAMA
```

### Performance Issues

**High Memory Usage:**

- Use smaller models (mistral:7b instead of mistral:8x7b)
- Limit concurrent requests
- Implement request queuing

**Slow Responses:**

- Enable GPU support if available
- Use response caching
- Optimize prompts

**Connection Timeouts:**

- Increase timeout values
- Implement retry logic
- Check network configuration

## 🎛️ Advanced Configuration

### 1. GPU Support (Optional)

For NVIDIA GPUs:

```yaml
# docker-compose.yml
ollama:
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
```

### 2. Custom Models

```bash
# Create custom model for C++ tutoring
cat > Modelfile << EOF
FROM mistral
PARAMETER temperature 0.7
PARAMETER top_p 0.9
SYSTEM "You are an expert C++ programming tutor..."
EOF

# Build custom model
docker exec codementor_ollama ollama create cpp-tutor -f Modelfile
```

### 3. Load Balancing

For high traffic:

```yaml
# docker-compose.yml
ollama-1:
  image: ollama/ollama:latest
  ports: ["11434:11434"]

ollama-2:
  image: ollama/ollama:latest
  ports: ["11435:11434"]
```

## 📊 Monitoring

### 1. Health Checks

```bash
# Automated health monitoring
while true; do
  if curl -f http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is healthy"
  else
    echo "❌ Ollama is down"
  fi
  sleep 60
done
```

### 2. Performance Metrics

```bash
# Monitor resource usage
docker stats codementor_ollama --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Check response times
curl -w "@curl-format.txt" -s -o /dev/null http://localhost:11434/api/generate
```

### 3. Logging

```bash
# View Ollama logs
docker logs -f codementor_ollama

# View backend AI logs
docker logs -f codementor_backend | grep "AI"
```

## 🔒 Security

### 1. Network Security

```yaml
# Restrict Ollama access
ollama:
  networks:
    - internal_network # No external access
```

### 2. API Security

```typescript
// Rate limiting for AI endpoints
@UseGuards(JwtAuthGuard, ThrottlerGuard)
@Throttle(10, 60) // 10 requests per minute
async analyzeCode() {}
```

### 3. Input Validation

```typescript
// Sanitize user input
const sanitizedCode = input.replace(/[<>]/g, "");
const analysis = await aiService.analyzeCode(sanitizedCode);
```

## 🚀 Production Deployment

### 1. Resource Requirements

**Minimum:**

- 8GB RAM
- 4 CPU cores
- 50GB storage

**Recommended:**

- 16GB RAM
- 8 CPU cores
- 100GB SSD storage
- GPU (optional)

### 2. Scaling Considerations

```yaml
# docker-compose.prod.yml
ollama:
  deploy:
    replicas: 2
    resources:
      limits:
        memory: 8G
        cpus: "4"
```

### 3. Backup Strategy

```bash
# Backup Ollama models
docker run --rm -v ollama_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/ollama-models.tar.gz /data
```

## 📚 Additional Resources

- [Ollama Documentation](https://ollama.ai/docs)
- [Mistral AI Documentation](https://docs.mistral.ai/)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)

## 🎉 Next Steps

1. **Complete the setup** using the automated script
2. **Test all AI features** in the app
3. **Monitor performance** and adjust as needed
4. **Customize prompts** for your specific use case
5. **Scale up** when ready for production

The AI-powered CodeMentor AI is now ready to provide intelligent tutoring! 🚀
