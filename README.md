# CodeMentor AI - React Native Mobil Uygulama

🧠 **CodeMentor AI** - C ve C++ öğrenme platformunun React Native ile geliştirilmiş mobil uygulaması.

## 📱 Özellikler

### Ana Ekranlar

- **🏠 Ana Sayfa**: Platform tanıtımı, popüler kurslar ve istatistikler
- **📚 Kurslar**: C ve C++ kursları, filtreleme ve arama
- **🎯 Alıştırmalar**: Pratik problemler, günlük challenge'lar
- **🤖 AI Chat**: Gerçek zamanlı AI destekli sohbet
- **👤 Profil**: Kullanıcı profili, başarılar ve istatistikler

### Ek Özellikler

- **💻 Kod Editörü**: Mobil kod yazma ve test etme
- **📝 Quiz Sistemi**: Bilgi testleri (geliştirme aşamasında)
- **👥 Forum**: Topluluk etkileşimi (geliştirme aşamasında)
- **📊 İlerleme Takibi**: Detaylı analiz (geliştirme aşamasında)
- **🎓 AI Mentor**: Kişisel rehberlik (geliştirme aşamasında)

## 🛠 Teknolojiler

- **React Native**: Mobil uygulama geliştirme
- **Expo**: Geliştirme platformu
- **TypeScript**: Tip güvenliği
- **React Navigation**: Navigasyon sistemi
- **React Native Paper**: Material Design UI
- **Expo Vector Icons**: İkonlar
- **Linear Gradient**: Gradient efektleri

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js (v16 veya üstü)
- npm veya yarn
- Expo CLI
- Docker ve Docker Compose (AI özellikler için)
- iOS Simulator (Mac) veya Android Emulator

### 🐳 Docker ile Kurulum (Önerilen)

```bash
# 1. Docker Compose ile tüm servisleri başlat
docker-compose up -d

# 2. Web uygulamasına erişim
# http://localhost:3000

# 3. Ollama AI API
# http://localhost:11434
```

### 💻 Yerel Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Web hatalarını düzeltmek için ek paketler
npx expo install react-native-web@~0.19.6 react-dom@18.2.0 @expo/webpack-config@^19.0.0
```

### 🏃‍♂️ Çalıştırma Seçenekleri

#### Web'de Çalıştır (AI Destekli)

```bash
# Docker ile AI desteği
docker-compose up -d ollama  # AI servisi
npx expo start --web         # Web uygulaması

# Veya tam Docker setup
docker-compose up -d
```

#### Mobil Geliştirme

```bash
# Geliştirme sunucusunu başlat
npx expo start

# iOS simülatörde çalıştır
npx expo start --ios

# Android emülatörde çalıştır
npx expo start --android

# Web'de çalıştır
npx expo start --web
```

## 📁 Proje Yapısı

```
├── App.tsx                 # Ana uygulama bileşeni
├── app.json               # Expo konfigürasyonu
├── package.json           # Bağımlılıklar
├── tsconfig.json          # TypeScript konfigürasyonu
├── babel.config.js        # Babel konfigürasyonu
└── src/
    └── screens/           # Ekran bileşenleri
        ├── HomeScreen.tsx
        ├── CoursesScreen.tsx
        ├── ExercisesScreen.tsx
        ├── AIChatScreen.tsx
        ├── ProfileScreen.tsx
        ├── CodeEditorScreen.tsx
        ├── LoginScreen.tsx
        └── ...
```

## 🎨 Tasarım Sistemi

### Renkler

- **Ana Renk**: #3b82f6 (Blue)
- **İkincil Renk**: #8b5cf6 (Purple)
- **Arka Plan**: #030712 (Dark Navy)
- **Kart Arka Planı**: #0f172a (Slate)
- **Border**: #334155 (Slate)

### Tipografi

- **Ana Font**: System Font
- **Kod Font**: Monospace
- **Boyutlar**: 12px - 32px

## 📱 Ekran Görünümleri

### Ana Sayfa

- Logo ve navigasyon
- Hero section gradient ile
- İstatistik kartları
- Özellik gösterimi
- Popüler kurslar (yatay scroll)
- CTA section

### Kurslar

- Arama ve filtreleme
- Kurs kartları
- İlerleme gösterimi
- Seviye badgeleri

### AI Chat

- Gerçek zamanlı mesajlaşma
- Kod blokları destekli
- Hızlı aksiyonlar
- Örnek sorular

### Profil

- Kullanıcı bilgileri
- İstatistik kartları
- Başarı rozetleri
- Tab navigasyon

## 🔧 Geliştirme Notları

### Navigation

- React Navigation 6 kullanılıyor
- Bottom Tabs + Stack Navigation
- Deep linking desteği

### State Management

- React Hooks (useState, useEffect)
- Context API (gelecekte Redux eklenebilir)

### Styling

- StyleSheet API
- Responsive tasarım
- Dark theme odaklı

### Components

- React Native Paper
- Custom components
- Reusable patterns

## ✅ Yeni Eklenen Özellikler

### 🤖 AI Entegrasyonu

- **Ollama Llama3** ile gerçek AI desteği
- C/C++ kod analizi ve açıklama
- Hata ayıklama yardımı
- Kişiselleştirilmiş öğrenme önerileri

### 👤 Authentication System

- Mock kullanıcı sistemi
- Demo hesapları (Beginner, Intermediate, Expert)
- Kullanıcı profilleri ve istatistikler
- Local storage persistence

### 🐳 Docker Support

- Multi-stage Docker build
- Ollama AI servisi otomatik kurulumu
- Docker Compose ile kolay deployment
- Production-ready containerization

## 🚧 Geliştirme Aşamasındaki Özellikler

- [ ] Quiz sistemi implementasyonu
- [ ] Forum ve topluluk özellikleri
- [ ] Gerçek backend API entegrasyonu
- [ ] Advanced AI Mentor features
- [ ] Kod editörü syntax highlighting
- [ ] Push notification
- [ ] Offline support
- [ ] Performance optimizasyonları

## 📦 Build ve Deploy

### Development Build

```bash
expo build:android
expo build:ios
```

### Production Build

```bash
expo build:android --type app-bundle
expo build:ios --type archive
```

## 🎯 Gelecek Özellikler

- **🔥 Advanced Code Editor**: Syntax highlighting, autocomplete
- **📊 Analytics**: Detaylı kullanım analitikleri
- **🎮 Gamification**: Daha fazla oyun elementi
- **🌐 Social Features**: Arkadaş sistemi, leaderboard
- **📱 Native Modules**: Platform specific özellikler
- **☁️ Cloud Sync**: Çoklu cihaz senkronizasyonu

