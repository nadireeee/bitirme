import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Chip, Button, Avatar, ProgressBar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import responsive, {
  wp,
  hp,
  typography,
  spacing,
  commonStyles,
  getGridColumns,
  getCardWidth,
  isTablet,
  isSmallPhone,
} from "../utils/responsive";

const { width, height } = Dimensions.get("window");

const CourseDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = theme?.colors || {
    background: "#030712",
    surface: "#0f172a",
    text: "#f9fafb",
    textSecondary: "#94a3b8",
    outline: "#334155",
    primary: "#3b82f6",
  };
  const [activeTab, setActiveTab] = useState("overview");

  // Mock course data - normally would come from route params or API
  const courseId = route.params?.courseId || 1;

  const course = {
    id: courseId,
    title: "C++ ve Nesne Yönelimli Programlama",
    description:
      "C++ dilinin temellerinden başlayarak nesne yönelimli programlama konseptlerini öğrenin. Sınıflar, kalıtım, polimorfizm ve daha fazlası.",
    instructor: "Dr. Mehmet Yılmaz",
    instructorImage: "https://i.pravatar.cc/100?img=1",
    rating: 4.9,
    students: 2456,
    duration: "8 hafta",
    level: "Orta",
    price: "Ücretsiz",
    enrolled: true,
    progress: 65,
    totalLessons: 24,
    completedLessons: 15,
    skills: [
      "C++ Syntax",
      "OOP",
      "Classes",
      "Inheritance",
      "Polymorphism",
      "Encapsulation",
      "STL",
      "Templates",
    ],
    lessons: [
      {
        id: 1,
        title: "C++ Temelleri",
        duration: "45 dk",
        completed: true,
        locked: false,
      },
      {
        id: 2,
        title: "Sınıflar ve Nesneler",
        duration: "60 dk",
        completed: true,
        locked: false,
      },
      {
        id: 3,
        title: "Kalıtım (Inheritance)",
        duration: "75 dk",
        completed: false,
        locked: false,
      },
      {
        id: 4,
        title: "Polimorfizm",
        duration: "50 dk",
        completed: false,
        locked: true,
      },
    ],
    requirements: [
      "Temel programlama bilgisi",
      "C dilinde deneyim (tercihan)",
      "Bilgisayar ve internet erişimi",
    ],
    whatYoullLearn: [
      "C++ dilinin temel yapıları",
      "Nesne yönelimli programlama prensipleri",
      "Sınıf tasarımı ve implementasyonu",
      "Kalıtım ve polimorfizm kavramları",
      "STL kullanımı",
      "Modern C++ özellikleri",
    ],
  };

  const tabs = [
    { id: "overview", name: "Genel Bakış", icon: "information-circle-outline" },
    { id: "curriculum", name: "Müfredat", icon: "list-outline" },
    { id: "instructor", name: "Eğitmen", icon: "person-outline" },
    { id: "reviews", name: "Yorumlar", icon: "star-outline" },
  ];

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kurs Hakkında</Text>
        <Text style={styles.sectionText}>{course.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Neler Öğreneceksiniz</Text>
        {course.whatYoullLearn.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gereksinimler</Text>
        {course.requirements.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Ionicons name="document-text-outline" size={20} color="#64748b" />
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kazanacağınız Beceriler</Text>
        <View style={styles.skillsContainer}>
          {course.skills.map((skill, index) => (
            <Chip
              key={index}
              mode="outlined"
              style={styles.skillChip}
              textStyle={styles.skillText}
            >
              {skill}
            </Chip>
          ))}
        </View>
      </View>
    </View>
  );

  const renderCurriculum = () => (
    <View style={styles.tabContent}>
      <View style={styles.progressInfo}>
        <Text style={styles.progressTitle}>
          İlerleme: {course.completedLessons}/{course.totalLessons} ders
        </Text>
        <ProgressBar
          progress={course.progress / 100}
          color="#3b82f6"
          style={styles.progressBar}
        />
        <Text style={styles.progressText}>%{course.progress} tamamlandı</Text>
      </View>

      {course.lessons.map((lesson, index) => (
        <Card key={lesson.id} style={styles.lessonCard}>
          <Card.Content style={styles.lessonContent}>
            <View style={styles.lessonHeader}>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDuration}>{lesson.duration}</Text>
              </View>
              <View style={styles.lessonStatus}>
                {lesson.completed && (
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                )}
                {lesson.locked && (
                  <Ionicons name="lock-closed" size={24} color="#64748b" />
                )}
                {!lesson.completed && !lesson.locked && (
                  <Ionicons name="play-circle" size={24} color="#3b82f6" />
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );

  const renderInstructor = () => (
    <View style={styles.tabContent}>
      <Card style={styles.instructorCard}>
        <Card.Content style={styles.instructorContent}>
          <Avatar.Image
            size={isTablet() ? 100 : 80}
            source={{ uri: course.instructorImage }}
          />
          <View style={styles.instructorInfo}>
            <Text style={styles.instructorName}>{course.instructor}</Text>
            <Text style={styles.instructorTitle}>
              C++ Uzmanı & Yazılım Geliştirici
            </Text>
            <View style={styles.instructorStats}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>15+</Text>
                <Text style={styles.statLabel}>Yıl Deneyim</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>50K+</Text>
                <Text style={styles.statLabel}>Öğrenci</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>4.9</Text>
                <Text style={styles.statLabel}>Puan</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eğitmen Hakkında</Text>
        <Text style={styles.sectionText}>
          Dr. Mehmet Yılmaz, 15 yılı aşkın deneyime sahip bir yazılım
          geliştirici ve eğitmendir. Microsoft, Google gibi büyük teknoloji
          şirketlerinde çalışmış ve binlerce öğrenciye programlama öğretmiştir.
        </Text>
      </View>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      <View style={styles.reviewsHeader}>
        <Text style={styles.sectionTitle}>Öğrenci Yorumları</Text>
        <View style={styles.ratingInfo}>
          <Text style={styles.ratingNumber}>{course.rating}</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons key={star} name="star" size={16} color="#fbbf24" />
            ))}
          </View>
          <Text style={styles.reviewCount}>
            ({course.students} değerlendirme)
          </Text>
        </View>
      </View>

      {/* Sample reviews */}
      {[
        {
          name: "Ahmet K.",
          rating: 5,
          comment: "Harika bir kurs! C++'ı çok iyi öğrendim.",
          date: "2 hafta önce",
        },
        {
          name: "Elif S.",
          rating: 4,
          comment: "Anlatım çok net, örnekler güzel.",
          date: "1 ay önce",
        },
      ].map((review, index) => (
        <Card key={index} style={styles.reviewCard}>
          <Card.Content>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewName}>{review.name}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <View style={styles.reviewRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={14}
                  color={star <= review.rating ? "#fbbf24" : "#64748b"}
                />
              ))}
            </View>
            <Text style={styles.reviewText}>{review.comment}</Text>
          </Card.Content>
        </Card>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "curriculum":
        return renderCurriculum();
      case "instructor":
        return renderInstructor();
      case "reviews":
        return renderReviews();
      default:
        return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#3b82f6", "#8b5cf6"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseSubtitle}>
            {course.instructor} • {course.level} • {course.duration}
          </Text>

          <View style={styles.courseStats}>
            <View style={styles.courseStat}>
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text style={styles.courseStatText}>{course.rating}</Text>
            </View>
            <View style={styles.courseStat}>
              <Ionicons name="people" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.courseStatText}>{course.students}</Text>
            </View>
            <View style={styles.courseStat}>
              <Ionicons name="time" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.courseStatText}>{course.duration}</Text>
            </View>
          </View>

          {course.enrolled && (
            <View style={styles.enrolledBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.enrolledText}>Kayıtlı</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons
                name={tab.icon as any}
                size={18}
                color={activeTab === tab.id ? "#3b82f6" : "#64748b"}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab.id ? "#3b82f6" : "#64748b" },
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {renderTabContent()}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Fiyat</Text>
          <Text style={styles.price}>{course.price}</Text>
        </View>
        <Button
          mode="contained"
          style={styles.actionButton}
          labelStyle={styles.actionButtonText}
          onPress={() => {
            if (course.enrolled) {
              // Continue course
              navigation.navigate("CodeEditor");
            } else {
              // Enroll in course
              Alert.alert(
                "Kursa Kayıt",
                "Kursa kayıt olmak istediğinizden emin misiniz?",
              );
            }
          }}
        >
          {course.enrolled ? "Dersi Devam Et" : "Kursa Kaydol"}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  header: {
    paddingTop: isTablet() ? spacing.xxl : spacing.xxl + 20,
    paddingBottom: spacing.xl,
    paddingHorizontal: isSmallPhone()
      ? spacing.lg
      : isTablet()
        ? spacing.xxl
        : spacing.xl,
  },
  headerContent: {
    maxWidth: isTablet() ? wp(90) : "100%",
    alignSelf: "center",
    width: "100%",
  },
  courseTitle: {
    fontSize: isSmallPhone()
      ? typography.h3
      : isTablet()
        ? typography.h1
        : typography.h2,
    fontWeight: "800",
    color: "white",
    marginBottom: spacing.xs,
    lineHeight: isSmallPhone()
      ? typography.h3 * 1.2
      : isTablet()
        ? typography.h1 * 1.2
        : typography.h2 * 1.2,
  },
  courseSubtitle: {
    fontSize: isTablet() ? typography.h6 : typography.body1,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: spacing.md,
  },
  courseStats: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  courseStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs / 2,
  },
  courseStatText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: typography.body2,
    fontWeight: "600",
  },
  enrolledBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: spacing.xl,
    alignSelf: "flex-start",
  },
  enrolledText: {
    color: "#10b981",
    fontSize: typography.body2,
    fontWeight: "600",
  },
  tabsContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  tabsContent: {
    paddingHorizontal: isSmallPhone()
      ? spacing.lg
      : isTablet()
        ? spacing.xxl
        : spacing.xl,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: typography.body2,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: isSmallPhone()
      ? 0
      : isTablet()
        ? spacing.xxl
        : spacing.lg,
  },
  tabContent: {
    padding: isSmallPhone()
      ? spacing.lg
      : isTablet()
        ? spacing.xxl
        : spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: isTablet() ? typography.h4 : typography.h5,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionText: {
    fontSize: isTablet() ? typography.body1 : typography.body2,
    color: colors.textSecondary,
    lineHeight: isTablet() ? typography.body1 * 1.6 : typography.body2 * 1.6,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  listText: {
    flex: 1,
    fontSize: typography.body2,
    color: colors.textSecondary,
    lineHeight: typography.body2 * 1.5,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  skillChip: {
    backgroundColor: "transparent",
    borderColor: "#3b82f6",
  },
  skillText: {
    fontSize: typography.caption,
    color: "#3b82f6",
  },
  progressInfo: {
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
  },
  progressTitle: {
    fontSize: typography.h6,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  progressText: {
    fontSize: typography.body2,
    color: colors.textSecondary,
    textAlign: "right",
  },
  lessonCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    marginBottom: spacing.sm,
  },
  lessonContent: {
    padding: spacing.md,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: typography.h6,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  lessonDuration: {
    fontSize: typography.body2,
    color: colors.textSecondary,
  },
  lessonStatus: {
    marginLeft: spacing.md,
  },
  instructorCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    marginBottom: spacing.xl,
  },
  instructorContent: {
    padding: spacing.lg,
    alignItems: "center",
  },
  instructorInfo: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  instructorName: {
    fontSize: typography.h5,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  instructorTitle: {
    fontSize: typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  instructorStats: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: typography.h6,
    fontWeight: "700",
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },
  ratingInfo: {
    alignItems: "center",
  },
  ratingNumber: {
    fontSize: typography.h4,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
    marginBottom: spacing.xs / 2,
  },
  reviewCount: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    marginBottom: spacing.md,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  reviewName: {
    fontSize: typography.body1,
    fontWeight: "600",
    color: colors.text,
  },
  reviewDate: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  reviewRating: {
    flexDirection: "row",
    gap: 2,
    marginBottom: spacing.sm,
  },
  reviewText: {
    fontSize: typography.body2,
    color: colors.textSecondary,
    lineHeight: typography.body2 * 1.5,
  },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
    gap: spacing.md,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  price: {
    fontSize: typography.h5,
    fontWeight: "700",
    color: colors.text,
  },
  actionButton: {
    backgroundColor: "#3b82f6",
    borderRadius: spacing.sm,
    flex: 2,
  },
  actionButtonText: {
    fontSize: typography.body1,
    fontWeight: "600",
    color: "white",
  },
});

export default CourseDetailScreen;
