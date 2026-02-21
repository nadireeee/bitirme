# 📱 Responsive Design System

Bu React Native uygulaması artık tüm cihaz boyutları için tam responsive design ile gelir.

## 🎯 Desteklenen Cihazlar

- **📱 Küçük Telefonlar** (< 375px) - iPhone SE, eski Android cihazlar
- **📱 Normal Telefonlar** (375px - 768px) - iPhone, Android telefonlar
- **📲 Tabletler** (768px - 1024px) - iPad, Android tabletler
- **💻 Büyük Tabletler** (> 1024px) - iPad Pro, büyük Android tabletler

## 🛠️ Responsive Utilities

### `src/utils/responsive.ts`

Tüm responsive hesaplamalar için merkezi utility dosyası:

```typescript
import {
  wp,
  hp,
  typography,
  spacing,
  isTablet,
  isSmallPhone,
} from "../utils/responsive";

// Ekran genişliği ve yüksekliği yüzdesi
const buttonWidth = wp(50); // Ekran genişliğinin %50'si
const headerHeight = hp(10); // Ekran yüksekliğinin %10'u

// Responsive font boyutları
const titleSize = typography.h1; // Cihaza göre otomatik ayarlanan

// Responsive spacing
const padding = spacing.lg; // Cihaza göre ayarlanan spacing

// Cihaz kontrolü
if (isTablet()) {
  // Tablet için özel kod
}
```

### Responsive Theme System

`src/styles/responsiveTheme.ts` - Merkezi tema sistemi

## 📦 Responsive Components

### ResponsiveContainer

```tsx
import ResponsiveContainer from "../components/common/ResponsiveContainer";

<ResponsiveContainer maxWidth centerContent padding="lg">
  <Text>Content</Text>
</ResponsiveContainer>;
```

### ResponsiveGrid

```tsx
import ResponsiveGrid from "../components/common/ResponsiveGrid";

<ResponsiveGrid columns={2} spacing={16}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</ResponsiveGrid>;
```

### ResponsiveText

```tsx
import ResponsiveText from "../components/common/ResponsiveText";

<ResponsiveText variant="h1" color="primary" center bold>
  Responsive Title
</ResponsiveText>;
```

## 🔄 Orientation Support

`src/hooks/useOrientation.ts` - Orientation değişikliklerini handle eder

```tsx
import useOrientation from "../hooks/useOrientation";

const { isLandscape, isTablet, width, height } = useOrientation();
```

## 📐 Responsive Breakpoints

- **xs**: 0px+
- **sm**: 375px+ (Normal telefon)
- **md**: 768px+ (Tablet)
- **lg**: 1024px+ (Büyük tablet)
- **xl**: 1200px+ (Desktop)

## 🎨 Responsive Design Patterns

### 1. Flexible Layouts

- Flexbox kullanımı
- Yüzde bazlı genişlikler
- Minimum ve maksimum boyutlar

### 2. Typography Scale

- Cihaz boyutuna göre font ölçekleme
- Responsive line height
- Tablet için letter spacing

### 3. Touch Targets

- Minimum 44px touch target
- Tablet için büyütülmüş touch alanları

### 4. Grid System

- Responsive column sayısı
- Adaptive spacing
- Flexible card boyutları

## 🚀 Kullanım Örnekleri

### Responsive Card Grid

```tsx
const styles = StyleSheet.create({
  card: {
    width: getCardWidth(getGridColumns()),
    borderRadius: spacing.lg,
    padding: spacing.md,
  },
});
```

### Responsive Typography

```tsx
const styles = StyleSheet.create({
  title: {
    fontSize: isTablet() ? typography.h1 : typography.h2,
    lineHeight: isTablet() ? typography.h1 * 1.2 : typography.h2 * 1.3,
  },
});
```

### Responsive Spacing

```tsx
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: isSmallPhone() ? spacing.sm : spacing.lg,
    paddingVertical: spacing.xl,
  },
});
```

## ✅ Tüm Ekranlar Responsive

Tüm ekranlar responsive design system ile güncellenmiştir:

- ✅ HomeScreen
- ✅ CoursesScreen
- ✅ ExercisesScreen
- ✅ ProfileScreen
- ✅ LoginScreen
- ✅ CodeEditorScreen
- ✅ AIChatScreen
- ✅ ForumScreen
- ✅ CourseDetailScreen
- ✅ AIMentorScreen
- ✅ ProgressScreen
- ✅ QuizScreen

## 📱 Test Edilmiş Cihazlar

- iPhone SE (375x667)
- iPhone 12 (390x844)
- iPhone 12 Pro Max (428x926)
- iPad (768x1024)
- iPad Pro (1024x1366)
- Samsung Galaxy S21 (360x800)
- Samsung Galaxy Tab (800x1280)

## 🔧 Gelecek Özellikler

- [ ] Dark/Light mode responsive optimizasyonları
- [ ] Accessibility responsive özellikleri
- [ ] Performance optimizasyonları
- [ ] Responsive animasyonlar

Bu responsive design sistemi ile uygulamanız tüm cihazlarda mükemmel görünecek! 🎉
