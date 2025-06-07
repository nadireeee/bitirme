# PowerShell Setup Guide for CodeMentor AI

Bu döküman, Windows PowerShell kullanıcıları için CodeMentor AI projesinin kurulum ve çalıştırma rehberidir.

## Gereksinimler

### Temel Gereksinimler

- **Windows 10/11** with PowerShell 5.1 veya daha yeni
- **Docker Desktop for Windows** (çalışır durumda)
- **Node.js** (16 veya daha yeni)
- **npm** veya **yarn**

### PowerShell Execution Policy

PowerShell scriptlerini çalıştırabilmek için execution policy'yi ayarlamanız gerekebilir:

```powershell
# Geçici olarak (sadece bu oturum için)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Kalıcı olarak (mevcut kullanıcı için)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Kurulum

### 1. Proje Klonlama

```powershell
git clone <repository-url>
cd codementor-ai-mobile
```

### 2. Bağımlılık Kurulumu

```powershell
# Ana proje bağımlılıkları
npm install

# Backend bağımlılıkları
cd backend
npm install
cd ..
```

### 3. AI Sistemi Kurulumu (Ollama + Mistral)

#### PowerShell Script Kullanarak:

```powershell
npm run setup:ai:ps
```

#### Manuel Kurulum:

```powershell
cd backend
powershell -ExecutionPolicy Bypass -File scripts/setup-ollama.ps1
```

### 4. Backend Kurulumu ve Başlatma

#### PowerShell Script Kullanarak:

```powershell
npm run backend:start:ps
```

#### Manuel Kurulum:

```powershell
cd backend
powershell -ExecutionPolicy Bypass -File scripts/start.ps1
```

## PowerShell Scriptleri

### `setup-ollama.ps1`

AI sistemi kurulum scripti:

- Docker kontrolleri
- Ollama servisini başlatır
- Mistral modelini indirir
- AI sistemini test eder
- Opsiyonel web UI başlatır

**Özellikler:**

- ✅ Renkli çıktı
- ✅ Hata yakalama
- ✅ İlerleme gösterimi
- ✅ Otomatik sağlık kontrolleri

### `start.ps1`

Backend başlatma scripti:

- Docker kontrolleri
- PostgreSQL ve Redis başlatır
- Veritabanı migrasyonları
- Backend server başlatır

**Özellikler:**

- ✅ Otomatik .env dosyası oluşturma
- ✅ Bağımlılık kontrolleri
- ✅ Veritabanı hazırlık kontrolü
- ✅ Renkli çıktı ve durum mesajları

## NPM Scripts

### AI Kurulum Scriptleri

```powershell
# Linux/macOS için bash script
npm run setup:ai

# Windows PowerShell için
npm run setup:ai:ps
```

### Backend Scriptleri

```powershell
# Standard backend başlatma
npm run backend:start

# PowerShell ile backend başlatma
npm run backend:start:ps

# Backend kurulum (platform bağımsız)
npm run backend:setup
```

### Frontend Scriptleri

```powershell
# Expo geliştirme sunucusu
npm start

# Platform-spesifik başlatma
npm run android
npm run ios
npm run web
```

## Troubleshooting

### Docker Sorunları

```powershell
# Docker durumunu kontrol et
docker info

# Docker servislerini yeniden başlat
docker-compose down
docker-compose up -d
```

### PowerShell Execution Policy Sorunları

```powershell
# Mevcut policy'yi kontrol et
Get-ExecutionPolicy -List

# Geçici çözüm
powershell -ExecutionPolicy Bypass -File scripts/setup-ollama.ps1
```

### Port Sorunları

Eğer portlar kullanımda ise:

- **3000**: Backend API
- **11434**: Ollama API
- **8081**: Ollama Web UI
- **5432**: PostgreSQL
- **6379**: Redis

```powershell
# Port kullanımını kontrol et
netstat -an | Select-String "3000"
netstat -an | Select-String "11434"
```

### Ollama Model Sorunları

```powershell
# Modelleri listele
docker exec codementor_ollama ollama list

# Mistral'ı yeniden indir
docker exec codementor_ollama ollama pull mistral

# Model testi
docker exec codementor_ollama ollama run mistral "Test"
```

## Performans Optimizasyonu

### Docker Resource Ayarları

Docker Desktop → Settings → Resources:

- **CPU**: En az 4 core
- **Memory**: En az 8GB
- **Disk**: En az 10GB boş alan

### PowerShell Profil Optimizasyonu

PowerShell profilinize ekleyebileceğiniz alias'lar:

```powershell
# PowerShell profilinizi düzenleyin: notepad $PROFILE

# Yararlı alias'lar
function Start-CodeMentorAI { npm run setup:ai:ps }
function Start-Backend { npm run backend:start:ps }
function Check-Docker { docker info }

# Alias'lar
Set-Alias -Name aisetup -Value Start-CodeMentorAI
Set-Alias -Name backend -Value Start-Backend
Set-Alias -Name dockercheck -Value Check-Docker
```

## Windows Terminal Konfigürasyonu

Daha iyi geliştirme deneyimi için Windows Terminal ayarları:

```json
{
  "name": "CodeMentor PowerShell",
  "commandline": "powershell.exe -WorkingDirectory C:\\path\\to\\codementor-ai-mobile",
  "icon": "ms-appx:///ProfileIcons/{61c54bbd-c2c6-5271-96e7-009a87ff44bf}.png"
}
```

## Güvenlik Notları

- PowerShell scriptleri sadece geliştirme ortamında çalıştırın
- Execution Policy'yi üretim sunucularında değiştirmemeye dikkat edin
- Docker konteynerlerinin güncel olduğundan emin olun
- .env dosyasında hassas bilgileri saklamayın

## Destek

Sorun yaşadığınızda:

1. Bu dökümanı tekrar okuyun
2. Docker ve PowerShell loglarını kontrol edin
3. GitHub Issues'da benzer sorunları arayın
4. Yeni issue açın (sorun detayları ile birlikte)

---

**Not**: Bu scriptler Windows PowerShell 5.1 ve PowerShell 7+ ile test edilmiştir.
