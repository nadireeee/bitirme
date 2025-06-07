import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Chip, Button, ProgressBar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import LanguageSwitch from "../components/common/LanguageSwitch";
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

const CoursesScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const courses = [
    {
      id: 1,
      title: "C Programlama Temelleri",
      description:
        "Sıfırdan başlayarak C programlama dilini öğrenin. Değişkenler, fonksiyonlar, döngüler ve daha fazlası.",
      instructor: "Dr. Ahmet Yılmaz",
      duration: "6 hafta",
      level: "Başlangıç",
      language: "C",
      students: 1247,
      rating: 4.8,
      reviews: 324,
      price: "Ücretsiz",
      progress: 0,
      isEnrolled: false,
      chapters: 12,
      totalLessons: 48,
      tags: ["Basics", "Variables", "Functions"],
      color: "#10b981",
    },
    {
      id: 2,
      title: "C++ ile Nesne Yönelimli Programlama",
      description:
        "OOP kavramlarını C++ ile pratiğe dökün. Sınıflar, kalıtım, polimorfizm ve encapsulation.",
      instructor: "Prof. Elif Kara",
      duration: "8 hafta",
      level: "Orta",
      language: "C++",
      students: 892,
      rating: 4.9,
      reviews: 267,
      price: "₺299",
      progress: 35,
      isEnrolled: true,
      chapters: 15,
      totalLessons: 62,
      tags: ["OOP", "Classes", "Inheritance"],
      color: "#3b82f6",
    },
    {
      id: 3,
      title: "Veri Yapıları ve Algoritmalar",
      description:
        "C++ ile veri yapıları ve algoritma analizi. Linked List, Stack, Queue, Trees ve Graph algoritmaları.",
      instructor: "Dr. Mehmet Demir",
      duration: "10 hafta",
      level: "İleri",
      language: "C++",
      students: 634,
      rating: 4.7,
      reviews: 189,
      price: "₺499",
      progress: 0,
      isEnrolled: false,
      chapters: 20,
      totalLessons: 85,
      tags: ["Data Structures", "Algorithms", "Trees"],
      color: "#ef4444",
    },
    {
      id: 4,
      title: "C++ STL ve Modern C++",
      description:
        "Standard Template Library kullanımı ve C++11/14/17/20 modern özellikler.",
      instructor: "Mühendis Ayşe Çelik",
      duration: "6 hafta",
      level: "İleri",
      language: "C++",
      students: 456,
      rating: 4.6,
      reviews: 123,
      price: "₺399",
      progress: 80,
      isEnrolled: true,
      chapters: 12,
      totalLessons: 45,
      tags: ["STL", "Modern C++", "Templates"],
      color: "#8b5cf6",
    },
  ];

  const levels = ["all", "Başlangıç", "Orta", "İleri"];
  const languages = ["all", "C", "C++"];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      selectedLevel === "all" || course.level === selectedLevel;
    const matchesLanguage =
      selectedLanguage === "all" || course.language === selectedLanguage;

    return matchesSearch && matchesLevel && matchesLanguage;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Başlangıç":
        return "#10b981";
      case "Orta":
        return "#3b82f6";
      case "İleri":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const renderCourseCard = ({ item: course }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("CourseDetail", { courseId: course.id })
      }
      style={styles.courseCardContainer}
    >
      <Card style={styles.courseCard}>
        <LinearGradient
          colors={[course.color, `${course.color}80`]}
          style={styles.courseHeader}
        >
          <View style={styles.courseHeaderContent}>
            <Ionicons name="code-slash" size={32} color="white" />
            {course.isEnrolled && (
              <View style={styles.enrolledBadge}>
                <Ionicons name="checkmark-circle" size={16} color="white" />
                <Text style={styles.enrolledText}>Kayıtlı</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <Card.Content style={styles.courseContent}>
          <View style={styles.courseMetaRow}>
            <Chip
              mode="outlined"
              textStyle={[
                styles.levelChipText,
                { color: getLevelColor(course.level) },
              ]}
              style={[
                styles.levelChip,
                { borderColor: getLevelColor(course.level) },
              ]}
            >
              {course.level}
            </Chip>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text style={styles.ratingText}>{course.rating}</Text>
              <Text style={styles.reviewsText}>({course.reviews})</Text>
            </View>
          </View>

          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDescription} numberOfLines={2}>
            {course.description}
          </Text>

          <View style={styles.courseStatsRow}>
            <View style={styles.courseStat}>
              <Ionicons name="time-outline" size={16} color="#64748b" />
              <Text style={styles.courseStatText}>{course.duration}</Text>
            </View>
            <View style={styles.courseStat}>
              <Ionicons name="people-outline" size={16} color="#64748b" />
              <Text style={styles.courseStatText}>{course.students}</Text>
            </View>
            <View style={styles.courseStat}>
              <Ionicons name="book-outline" size={16} color="#64748b" />
              <Text style={styles.courseStatText}>
                {course.totalLessons} ders
              </Text>
            </View>
          </View>

          {course.isEnrolled && course.progress > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>İlerleme</Text>
                <Text style={styles.progressPercentage}>
                  {course.progress}%
                </Text>
              </View>
              <ProgressBar
                progress={course.progress / 100}
                color="#3b82f6"
                style={styles.progressBar}
              />
            </View>
          )}

          <View style={styles.tagsContainer}>
            {course.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                mode="outlined"
                style={styles.tagChip}
                textStyle={styles.tagText}
              >
                {tag}
              </Chip>
            ))}
          </View>

          <View style={styles.courseFooter}>
            <Text style={styles.coursePrice}>{course.price}</Text>
            <Button
              mode={course.isEnrolled ? "outlined" : "contained"}
              onPress={() =>
                navigation.navigate("CourseDetail", { courseId: course.id })
              }
              style={styles.courseButton}
              labelStyle={styles.courseButtonText}
            >
              {course.isEnrolled ? (
                <>
                  <Ionicons name="play" size={16} color="#3b82f6" />
                  {" Devam Et"}
                </>
              ) : (
                <>
                  <Ionicons name="book-outline" size={16} color="white" />
                  {" İncele"}
                </>
              )}
            </Button>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kurslar</Text>
        <Text style={styles.headerSubtitle}>
          C ve C++ programlama dillerini AI destekli kurslarla öğrenin
        </Text>
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#64748b"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Kurs ara..."
            placeholderTextColor="#64748b"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
        >
          <Text style={styles.filterLabel}>Seviye:</Text>
          {levels.map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setSelectedLevel(level)}
              style={[
                styles.filterChip,
                selectedLevel === level && styles.activeFilterChip,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedLevel === level && styles.activeFilterChipText,
                ]}
              >
                {level === "all" ? "Tümü" : level}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.filterLabel, { marginLeft: 16 }]}>Dil:</Text>
          {languages.map((language) => (
            <TouchableOpacity
              key={language}
              onPress={() => setSelectedLanguage(language)}
              style={[
                styles.filterChip,
                selectedLanguage === language && styles.activeFilterChip,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedLanguage === language && styles.activeFilterChipText,
                ]}
              >
                {language === "all" ? "Tümü" : language}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Courses List */}
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.coursesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color="#64748b" />
            <Text style={styles.emptyTitle}>Kurs bulunamadı</Text>
            <Text style={styles.emptyDescription}>
              Arama kriterlerinizi değiştirerek tekrar deneyin
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
    lineHeight: 24,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#f9fafb",
  },
  filterScrollView: {
    flexDirection: "row",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f9fafb",
    alignSelf: "center",
    marginRight: 8,
  },
  filterChip: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  activeFilterChip: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  filterChipText: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  activeFilterChipText: {
    color: "white",
  },
  coursesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  courseCardContainer: {
    marginBottom: 20,
  },
  courseCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    overflow: "hidden",
  },
  courseHeader: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  courseHeaderContent: {
    alignItems: "center",
  },
  enrolledBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  enrolledText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
  courseContent: {
    padding: 20,
  },
  courseMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  levelChip: {
    alignSelf: "flex-start",
  },
  levelChipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f9fafb",
  },
  reviewsText: {
    fontSize: 14,
    color: "#64748b",
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
  },
  courseStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  courseStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  courseStatText: {
    fontSize: 12,
    color: "#64748b",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: "#94a3b8",
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f9fafb",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1e293b",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  tagChip: {
    backgroundColor: "transparent",
    borderColor: "#334155",
  },
  tagText: {
    fontSize: 12,
    color: "#94a3b8",
  },
  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coursePrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f9fafb",
  },
  courseButton: {
    borderRadius: 8,
  },
  courseButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f9fafb",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
});

export default CoursesScreen;
