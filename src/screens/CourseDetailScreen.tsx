import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
  const { colors } = useTheme();
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
      "STL",
    ],
    requirements: [
      "Temel programlama bilgisi",
      "C programlama deneyimi (önerilir)",
      "Bilgisayar ve internet bağlantısı",
    ],
    whatYouWillLearn: [
      "C++ dilinin temel syntax'ını",
      "Nesne yönelimli programlama prensiplerini",
      "Sınıf ve nesne kavramlarını",
      "Kalıtım ve polimorfizm",
      "STL (Standard Template Library) kullanımını",
      "Memory management",
      "Exception handling",
      "Modern C++ özellikleri",
    ],
  };

  const lessons = [
    {
      id: 1,
      title: "C++ Giriş ve Kurulum",
      duration: "15 dk",
      type: "video",
      completed: true,
      locked: false,
    },
    {
      id: 2,
      title: "Veri Tipleri ve Değişkenler",
      duration: "20 dk",
      type: "video",
      completed: true,
      locked: false,
    },
    {
      id: 3,
      title: "Fonksiyonlar ve Scope",
      duration: "25 dk",
      type: "video",
      completed: true,
      locked: false,
    },
    {
      id: 4,
      title: "Pratik: İlk C++ Programı",
      duration: "30 dk",
      type: "exercise",
      completed: false,
      locked: false,
    },
    {
      id: 5,
      title: "Sınıflar ve Nesneler",
      duration: "35 dk",
      type: "video",
      completed: false,
      locked: false,
    },
    {
      id: 6,
      title: "Constructor ve Destructor",
      duration: "20 dk",
      type: "video",
      completed: false,
      locked: true,
    },
  ];

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content style={styles.cardContent}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("courseDetail.aboutCourse", "Kurs Hakkında")}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {course.description}
          </Text>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content style={styles.cardContent}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("courseDetail.whatYouWillLearn", "Neler Öğreneceksiniz")}
          </Text>
          {course.whatYouWillLearn.map((item, index) => (
            <View key={index} style={styles.learnItem}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={colors.success}
              />
              <Text style={[styles.learnText, { color: colors.textSecondary }]}>
                {item}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content style={styles.cardContent}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("courseDetail.requirements", "Gereksinimler")}
          </Text>
          {course.requirements.map((req, index) => (
            <View key={index} style={styles.requirementItem}>
              <Ionicons name="ellipse" size={8} color={colors.textSecondary} />
              <Text
                style={[
                  styles.requirementText,
                  { color: colors.textSecondary },
                ]}
              >
                {req}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </View>
  );

  const renderLessons = () => (
    <View style={styles.tabContent}>
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.progressSection}>
            <Text style={[styles.progressTitle, { color: colors.text }]}>
              {t("courseDetail.progress", "İlerleme")}:{" "}
              {course.completedLessons}/{course.totalLessons}
            </Text>
            <ProgressBar
              progress={course.progress / 100}
              color={colors.primary}
              style={styles.progressBar}
            />
            <Text
              style={[styles.progressText, { color: colors.textSecondary }]}
            >
              %{course.progress} tamamlandı
            </Text>
          </View>
        </Card.Content>
      </Card>

      {lessons.map((lesson) => (
        <Card
          key={lesson.id}
          style={[
            styles.lessonCard,
            { backgroundColor: colors.card },
            lesson.locked && styles.lockedCard,
          ]}
        >
          <Card.Content style={styles.lessonContent}>
            <View style={styles.lessonHeader}>
              <View style={styles.lessonInfo}>
                <View style={styles.lessonIcon}>
                  <Ionicons
                    name={
                      lesson.completed
                        ? "checkmark-circle"
                        : lesson.locked
                          ? "lock-closed"
                          : lesson.type === "video"
                            ? "play-circle"
                            : "code-slash"
                    }
                    size={24}
                    color={
                      lesson.completed
                        ? colors.success
                        : lesson.locked
                          ? colors.textSecondary
                          : colors.primary
                    }
                  />
                </View>
                <View style={styles.lessonDetails}>
                  <Text
                    style={[
                      styles.lessonTitle,
                      {
                        color: lesson.locked
                          ? colors.textSecondary
                          : colors.text,
                      },
                    ]}
                  >
                    {lesson.title}
                  </Text>
                  <View style={styles.lessonMeta}>
                    <Ionicons
                      name="time"
                      size={12}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.lessonDuration,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {lesson.duration}
                    </Text>
                    <Chip
                      mode="outlined"
                      style={[styles.typeChip, { borderColor: colors.border }]}
                      textStyle={[
                        styles.typeChipText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {lesson.type === "video" ? "Video" : "Alıştırma"}
                    </Chip>
                  </View>
                </View>
              </View>
              {!lesson.locked && (
                <TouchableOpacity
                  style={[
                    styles.playButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => {
                    // Navigate to lesson player
                  }}
                >
                  <Ionicons
                    name={lesson.completed ? "refresh" : "play"}
                    size={16}
                    color="white"
                  />
                </TouchableOpacity>
              )}
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );

  const renderInstructor = () => (
    <View style={styles.tabContent}>
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.instructorSection}>
            <Avatar.Image
              size={80}
              source={{ uri: course.instructorImage }}
              style={styles.instructorAvatar}
            />
            <View style={styles.instructorInfo}>
              <Text style={[styles.instructorName, { color: colors.text }]}>
                {course.instructor}
              </Text>
              <Text
                style={[
                  styles.instructorTitle,
                  { color: colors.textSecondary },
                ]}
              >
                Senior C++ Developer & Educator
              </Text>
              <View style={styles.instructorStats}>
                <View style={styles.statItem}>
                  <Ionicons name="people" size={16} color={colors.primary} />
                  <Text
                    style={[styles.statText, { color: colors.textSecondary }]}
                  >
                    25K+ Öğrenci
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={16} color={colors.warning} />
                  <Text
                    style={[styles.statText, { color: colors.textSecondary }]}
                  >
                    4.8 Puan
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={[styles.instructorBio, { color: colors.textSecondary }]}>
            15+ yıllık deneyime sahip yazılım geliştirici. Google ve
            Microsoft'ta çalışmış, şu anda freelance danışman ve eğitmen olarak
            faaliyet gösteriyor.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "lessons":
        return renderLessons();
      case "instructor":
        return renderInstructor();
      default:
        return renderOverview();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Responsive Background Shapes */}
      <View style={styles.backgroundContainer}>
        <View
          style={[
            styles.backgroundShape1,
            { backgroundColor: `${colors.primary}08` },
          ]}
        />
        <View
          style={[
            styles.backgroundShape2,
            { backgroundColor: `${colors.secondary}06` },
          ]}
        />
        <View
          style={[
            styles.backgroundShape3,
            { backgroundColor: `${colors.success}04` },
          ]}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.header}
        >
          <View style={styles.courseHeader}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseInstructor}>
              {t("courseDetail.by", "Eğitmen:")} {course.instructor}
            </Text>

            <View style={styles.courseStats}>
              <View style={styles.stat}>
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text style={styles.statValue}>{course.rating}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons
                  name="people"
                  size={16}
                  color="rgba(255,255,255,0.8)"
                />
                <Text style={styles.statValue}>{course.students}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="time" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.statValue}>{course.duration}</Text>
              </View>
            </View>

            <View style={styles.skillsContainer}>
              {course.skills.slice(0, 3).map((skill, index) => (
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
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {course.enrolled ? (
            <Button
              mode="contained"
              style={[
                styles.primaryButton,
                { backgroundColor: colors.success },
              ]}
              onPress={() => setActiveTab("lessons")}
            >
              <Ionicons name="play" size={16} color="white" />
              <Text style={styles.buttonText}>
                {t("courseDetail.continueLesson", "Dersi Devam Et")}
              </Text>
            </Button>
          ) : (
            <Button
              mode="contained"
              style={[
                styles.primaryButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => {}}
            >
              <Text style={styles.buttonText}>
                {t("courseDetail.enrollNow", "Kursa Kayıt Ol")}
              </Text>
            </Button>
          )}

          <Button
            mode="outlined"
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={() => {}}
          >
            <Ionicons
              name="bookmark-outline"
              size={16}
              color={colors.primary}
            />
          </Button>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScrollView}
          >
            {[
              {
                id: "overview",
                label: t("courseDetail.overview", "Genel Bakış"),
                icon: "information-circle",
              },
              {
                id: "lessons",
                label: t("courseDetail.lessons", "Dersler"),
                icon: "play-circle",
              },
              {
                id: "instructor",
                label: t("courseDetail.instructor", "Eğitmen"),
                icon: "person",
              },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  { borderBottomColor: colors.border },
                  activeTab === tab.id && [
                    styles.activeTab,
                    { borderBottomColor: colors.primary },
                  ],
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={20}
                  color={
                    activeTab === tab.id ? colors.primary : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color:
                        activeTab === tab.id
                          ? colors.primary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  backgroundShape1: {
    position: "absolute",
    width: isTablet ? 400 : 300,
    height: isTablet ? 400 : 300,
    borderRadius: isTablet ? 200 : 150,
    top: -100,
    right: -100,
  },
  backgroundShape2: {
    position: "absolute",
    width: isTablet ? 300 : 200,
    height: isTablet ? 300 : 200,
    borderRadius: isTablet ? 150 : 100,
    bottom: 200,
    left: -50,
  },
  backgroundShape3: {
    position: "absolute",
    width: isTablet ? 200 : 150,
    height: isTablet ? 200 : 150,
    borderRadius: isTablet ? 100 : 75,
    top: height * 0.5,
    right: -30,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: isMobile ? 0 : isTablet ? 40 : 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: isMobile ? 20 : isTablet ? 40 : 30,
  },
  courseHeader: {
    alignItems: "flex-start",
    maxWidth: isTablet ? "70%" : "100%",
  },
  courseTitle: {
    fontSize: isMobile ? 22 : isTablet ? 32 : 26,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
    lineHeight: isMobile ? 28 : isTablet ? 40 : 32,
  },
  courseInstructor: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 16,
  },
  courseStats: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 20,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  skillText: {
    color: "white",
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: isTablet ? "row" : "row",
    paddingHorizontal: isMobile ? 20 : isTablet ? 40 : 30,
    paddingVertical: 20,
    gap: 12,
    marginTop: -15,
    maxWidth: isTablet ? 600 : "100%",
    alignSelf: isTablet ? "center" : "stretch",
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 4,
  },
  secondaryButton: {
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  tabsContainer: {
    paddingHorizontal: isMobile ? 20 : isTablet ? 40 : 30,
    marginBottom: 10,
    maxWidth: isTablet ? 800 : "100%",
    alignSelf: isTablet ? "center" : "stretch",
  },
  tabsScrollView: {
    flexDirection: "row",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  tabContent: {
    paddingHorizontal: isMobile ? 20 : isTablet ? 40 : 30,
    paddingBottom: 30,
    maxWidth: isTablet ? 800 : "100%",
    alignSelf: isTablet ? "center" : "stretch",
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  learnItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  learnText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: "right",
  },
  lessonCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  lockedCard: {
    opacity: 0.6,
  },
  lessonContent: {
    paddingVertical: 16,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lessonInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  lessonIcon: {
    marginRight: 16,
  },
  lessonDetails: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  lessonMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  lessonDuration: {
    fontSize: 12,
  },
  typeChip: {
    backgroundColor: "transparent",
    height: 24,
  },
  typeChipText: {
    fontSize: 10,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  instructorSection: {
    flexDirection: "row",
    marginBottom: 16,
  },
  instructorAvatar: {
    marginRight: 16,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  instructorTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  instructorStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  instructorBio: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default CourseDetailScreen;
