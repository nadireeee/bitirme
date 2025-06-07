import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Card, Button, Chip } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  RADIUS,
  SHADOWS,
  wp,
  hp,
  isSmallDevice,
} from "../styles/designSystem";

interface Course {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  lessons: number;
  enrolled: boolean;
  progress: number;
  category: string;
  thumbnail: string[];
}

const courses: Course[] = [
  {
    id: "1",
    title: "C++ Temelleri",
    description: "C++ programlamanın temel kavramları",
    level: "beginner",
    duration: "4 hafta",
    lessons: 12,
    enrolled: true,
    progress: 75,
    category: "Temel",
    thumbnail: [COLORS.primary, COLORS.info],
  },
  {
    id: "2",
    title: "Nesne Yönelimli Programlama",
    description: "OOP konseptleri ve uygulamaları",
    level: "intermediate",
    duration: "6 hafta",
    lessons: 18,
    enrolled: true,
    progress: 45,
    category: "OOP",
    thumbnail: [COLORS.success, COLORS.warning],
  },
  {
    id: "3",
    title: "Veri Yapıları",
    description: "Temel veri yapıları ve algoritmalar",
    level: "intermediate",
    duration: "8 hafta",
    lessons: 24,
    enrolled: false,
    progress: 0,
    category: "Algoritma",
    thumbnail: [COLORS.warning, COLORS.error],
  },
  {
    id: "4",
    title: "İleri C++ Teknikleri",
    description: "Template'ler, STL ve modern C++",
    level: "advanced",
    duration: "10 hafta",
    lessons: 30,
    enrolled: false,
    progress: 0,
    category: "İleri",
    thumbnail: [COLORS.error, COLORS.primary],
  },
];

const levelColors = {
  beginner: COLORS.success,
  intermediate: COLORS.warning,
  advanced: COLORS.error,
};

const levelLabels = {
  beginner: "Başlangıç",
  intermediate: "Orta",
  advanced: "İleri",
};

const CoursesScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "enrolled" | "available"
  >("all");

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredCourses = courses.filter((course) => {
    if (selectedFilter === "enrolled") return course.enrolled;
    if (selectedFilter === "available") return !course.enrolled;
    return true;
  });

  const enrolledCourses = courses.filter((course) => course.enrolled);
  const availableCourses = courses.filter((course) => !course.enrolled);

  const handleCoursePress = (course: Course) => {
    navigation.navigate("CourseDetail" as any, { courseId: course.id });
  };

  const renderCourseCard = (course: Course) => (
    <TouchableOpacity
      key={course.id}
      style={styles.courseCard}
      onPress={() => handleCoursePress(course)}
      activeOpacity={0.7}
    >
      <LinearGradient colors={course.thumbnail} style={styles.courseGradient}>
        <View style={styles.courseHeader}>
          <Chip
            mode="flat"
            textStyle={[
              styles.levelChipText,
              { color: levelColors[course.level] },
            ]}
            style={[
              styles.levelChip,
              { backgroundColor: `${levelColors[course.level]}20` },
            ]}
          >
            {levelLabels[course.level]}
          </Chip>
          {course.enrolled && (
            <View style={styles.enrolledBadge}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={COLORS.white}
              />
            </View>
          )}
        </View>

        <View style={styles.courseContent}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDescription}>{course.description}</Text>

          <View style={styles.courseMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={14} color={COLORS.white} />
              <Text style={styles.metaText}>{course.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="book" size={14} color={COLORS.white} />
              <Text style={styles.metaText}>{course.lessons} ders</Text>
            </View>
          </View>

          {course.enrolled && course.progress > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${course.progress}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                %{course.progress} tamamlandı
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kurslar</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterChips}>
              {[
                { key: "all", label: "Tümü" },
                { key: "enrolled", label: "Kayıtlı" },
                { key: "available", label: "Mevcut" },
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterChip,
                    selectedFilter === filter.key && styles.activeFilterChip,
                  ]}
                  onPress={() => setSelectedFilter(filter.key as any)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedFilter === filter.key &&
                        styles.activeFilterChipText,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Continue Learning Section */}
        {enrolledCourses.length > 0 && selectedFilter !== "available" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Öğrenmeye Devam Et</Text>
              {selectedFilter === "all" && (
                <TouchableOpacity onPress={() => setSelectedFilter("enrolled")}>
                  <Text style={styles.seeAllText}>Tümünü Gör</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {enrolledCourses.map(renderCourseCard)}
            </ScrollView>
          </View>
        )}

        {/* Available Courses Section */}
        {availableCourses.length > 0 && selectedFilter !== "enrolled" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mevcut Kurslar</Text>
              {selectedFilter === "all" && (
                <TouchableOpacity
                  onPress={() => setSelectedFilter("available")}
                >
                  <Text style={styles.seeAllText}>Tümünü Gör</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.coursesGrid}>
              {availableCourses.map(renderCourseCard)}
            </View>
          </View>
        )}

        {/* All Courses (when filter is specific) */}
        {selectedFilter !== "all" && (
          <View style={styles.section}>
            <View style={styles.coursesGrid}>
              {filteredCourses.map(renderCourseCard)}
            </View>
          </View>
        )}

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Kurs bulunamadı</Text>
            <Text style={styles.emptyDescription}>
              {selectedFilter === "enrolled"
                ? "Henüz hiçbir kursa kayıt olmadınız"
                : "Bu kategoride kurs bulunmuyor"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[8],
    paddingBottom: SPACING[4],
  },
  headerTitle: {
    fontSize: TYPOGRAPHY["3xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  searchButton: {
    padding: SPACING[2],
    borderRadius: RADIUS.base,
    backgroundColor: COLORS.surface,
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    paddingBottom: SPACING[4],
  },
  filterChips: {
    flexDirection: "row",
    paddingHorizontal: SPACING[4],
    gap: SPACING[2],
  },
  filterChip: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[2],
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
  },
  activeFilterChipText: {
    color: COLORS.white,
  },
  section: {
    marginBottom: SPACING[6],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING[4],
    marginBottom: SPACING[4],
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  horizontalScroll: {
    paddingLeft: SPACING[4],
    paddingRight: SPACING[4],
  },
  coursesGrid: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[4],
  },
  courseCard: {
    width: wp(85),
    marginRight: SPACING[4],
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    ...SHADOWS.md,
  },
  courseGradient: {
    padding: SPACING[4],
    minHeight: 160,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING[3],
  },
  levelChip: {
    borderRadius: RADIUS.full,
  },
  levelChipText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  enrolledBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: SPACING[1],
  },
  courseContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  courseTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    marginBottom: SPACING[1],
  },
  courseDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING[3],
  },
  courseMeta: {
    flexDirection: "row",
    gap: SPACING[4],
    marginBottom: SPACING[2],
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING[1],
  },
  metaText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.white,
    opacity: 0.8,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  progressContainer: {
    marginTop: SPACING[2],
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: SPACING[1],
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  progressText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.white,
    opacity: 0.8,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING[12],
    paddingHorizontal: SPACING[4],
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginTop: SPACING[4],
    marginBottom: SPACING[2],
  },
  emptyDescription: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
});

export default CoursesScreen;
