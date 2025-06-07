import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Chip, Button, ProgressBar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
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

const ExercisesScreen = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");

  const exercises = [
    {
      id: 1,
      title: "Hello World",
      description:
        "İlk C++ programınızı yazın. Ekrana 'Hello, World!' yazdıran bir program oluşturun.",
      difficulty: "Kolay",
      topic: "Basics",
      language: "C++",
      points: 10,
      timeLimit: "5 dk",
      submissions: 1247,
      successRate: 95,
      isCompleted: true,
      isPremium: false,
      tags: ["basics", "iostream", "cout"],
    },
    {
      id: 2,
      title: "Sayı Toplama",
      description: "Kullanıcıdan iki sayı alın ve toplamını ekrana yazdırın.",
      difficulty: "Kolay",
      topic: "I/O Operations",
      language: "C++",
      points: 15,
      timeLimit: "10 dk",
      submissions: 892,
      successRate: 87,
      isCompleted: true,
      isPremium: false,
      tags: ["input", "output", "variables"],
    },
    {
      id: 3,
      title: "Çift Sayı Kontrolü",
      description:
        "Verilen bir sayının çift mi tek mi olduğunu belirleyen program yazın.",
      difficulty: "Kolay",
      topic: "Conditionals",
      language: "C++",
      points: 20,
      timeLimit: "15 dk",
      submissions: 634,
      successRate: 82,
      isCompleted: false,
      isPremium: false,
      tags: ["if-else", "modulo", "conditionals"],
    },
    {
      id: 4,
      title: "Faktöriyel Hesaplama",
      description:
        "Recursive veya iterative yöntemle faktöriyel hesaplayan fonksiyon yazın.",
      difficulty: "Orta",
      topic: "Functions",
      language: "C++",
      points: 35,
      timeLimit: "25 dk",
      submissions: 456,
      successRate: 65,
      isCompleted: false,
      isPremium: false,
      tags: ["recursion", "loops", "functions"],
    },
    {
      id: 5,
      title: "Binary Search",
      description:
        "Sıralı bir dizide binary search algoritmasını implement edin.",
      difficulty: "Zor",
      topic: "Algorithms",
      language: "C++",
      points: 60,
      timeLimit: "45 dk",
      submissions: 189,
      successRate: 42,
      isCompleted: false,
      isPremium: true,
      tags: ["binary-search", "algorithms", "arrays"],
    },
  ];

  const stats = [
    { label: "Tamamlanan", value: "2", icon: "trophy" },
    { label: "Toplam Puan", value: "25", icon: "star" },
    { label: "Günlük Seri", value: "7", icon: "flame" },
    { label: "Başarı Oranı", value: "89%", icon: "trending-up" },
  ];

  const difficulties = ["all", "Kolay", "Orta", "Zor"];
  const topics = [
    "all",
    "Basics",
    "I/O Operations",
    "Conditionals",
    "Functions",
    "Algorithms",
  ];

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      exercise.difficulty === selectedDifficulty;
    const matchesTopic =
      selectedTopic === "all" || exercise.topic === selectedTopic;

    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Kolay":
        return "#10b981";
      case "Orta":
        return "#f59e0b";
      case "Zor":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const renderExerciseCard = ({ item: exercise }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("CodeEditor", { exerciseId: exercise.id })
      }
      style={styles.exerciseCardContainer}
    >
      <Card style={styles.exerciseCard}>
        <Card.Content style={styles.exerciseContent}>
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseMetaRow}>
              <View
                style={[
                  styles.difficultyDot,
                  { backgroundColor: getDifficultyColor(exercise.difficulty) },
                ]}
              />
              <Chip
                mode="outlined"
                textStyle={[
                  styles.difficultyChipText,
                  { color: getDifficultyColor(exercise.difficulty) },
                ]}
                style={[
                  styles.difficultyChip,
                  { borderColor: getDifficultyColor(exercise.difficulty) },
                ]}
              >
                {exercise.difficulty}
              </Chip>
              {exercise.isPremium && (
                <Chip
                  mode="outlined"
                  style={styles.premiumChip}
                  textStyle={styles.premiumText}
                >
                  Premium
                </Chip>
              )}
            </View>
            {exercise.isCompleted && (
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            )}
          </View>

          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
          <Text style={styles.exerciseDescription} numberOfLines={2}>
            {exercise.description}
          </Text>

          <View style={styles.exerciseStatsRow}>
            <View style={styles.exerciseStat}>
              <Ionicons name="star-outline" size={16} color="#64748b" />
              <Text style={styles.exerciseStatText}>
                {exercise.points} puan
              </Text>
            </View>
            <View style={styles.exerciseStat}>
              <Ionicons name="time-outline" size={16} color="#64748b" />
              <Text style={styles.exerciseStatText}>{exercise.timeLimit}</Text>
            </View>
            <View style={styles.exerciseStat}>
              <Text style={[styles.successRate, { color: "#10b981" }]}>
                %{exercise.successRate}
              </Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {exercise.tags.slice(0, 3).map((tag, index) => (
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

          <View style={styles.exerciseFooter}>
            <Text style={styles.submissionsText}>
              {exercise.submissions} çözüm
            </Text>
            <Button
              mode={exercise.isCompleted ? "outlined" : "contained"}
              onPress={() =>
                navigation.navigate("CodeEditor", { exerciseId: exercise.id })
              }
              style={styles.exerciseButton}
              labelStyle={styles.exerciseButtonText}
              disabled={exercise.isPremium && !exercise.isCompleted}
            >
              {exercise.isPremium && !exercise.isCompleted ? (
                <>
                  <Ionicons name="lock-closed" size={16} color="#64748b" />
                  {" Premium"}
                </>
              ) : exercise.isCompleted ? (
                <>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  {" Çözüldü"}
                </>
              ) : (
                <>
                  <Ionicons name="play" size={16} color="white" />
                  {" Çöz"}
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
        <Text style={styles.headerTitle}>Alıştırmalar</Text>
        <Text style={styles.headerSubtitle}>
          Pratik yaparak C ve C++ programlama becerilerinizi geliştirin
        </Text>
      </View>

      {/* Stats Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScrollView}
      >
        {stats.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name={stat.icon as any} size={24} color="#3b82f6" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

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
            placeholder="Alıştırma ara..."
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
          <Text style={styles.filterLabel}>Zorluk:</Text>
          {difficulties.map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              onPress={() => setSelectedDifficulty(difficulty)}
              style={[
                styles.filterChip,
                selectedDifficulty === difficulty && styles.activeFilterChip,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedDifficulty === difficulty &&
                    styles.activeFilterChipText,
                ]}
              >
                {difficulty === "all" ? "Tümü" : difficulty}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.filterLabel, { marginLeft: 16 }]}>Konu:</Text>
          {topics.slice(0, 4).map((topic) => (
            <TouchableOpacity
              key={topic}
              onPress={() => setSelectedTopic(topic)}
              style={[
                styles.filterChip,
                selectedTopic === topic && styles.activeFilterChip,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedTopic === topic && styles.activeFilterChipText,
                ]}
              >
                {topic === "all" ? "Tümü" : topic}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Daily Challenge */}
      <TouchableOpacity style={styles.dailyChallengeContainer}>
        <LinearGradient
          colors={["#3b82f6", "#8b5cf6"]}
          style={styles.dailyChallenge}
        >
          <View style={styles.dailyChallengeHeader}>
            <View style={styles.dailyChallengeIcon}>
              <Ionicons name="target" size={24} color="white" />
            </View>
            <View style={styles.dailyChallengeInfo}>
              <Text style={styles.dailyChallengeTitle}>Günün Problemi</Text>
              <Text style={styles.dailyChallengeSubtitle}>
                Fibonacci Serisi
              </Text>
            </View>
            <View style={styles.dailyChallengePoints}>
              <Text style={styles.dailyChallengePointsText}>50 puan</Text>
              <Text style={styles.dailyChallengeTime}>18:42:15</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Exercises List */}
      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.exercisesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="code-slash-outline" size={64} color="#64748b" />
            <Text style={styles.emptyTitle}>Alıştırma bulunamadı</Text>
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
  statsScrollView: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  statCard: {
    width: 120,
    marginRight: 12,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
  },
  statContent: {
    alignItems: "center",
    padding: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f9fafb",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
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
  dailyChallengeContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  dailyChallenge: {
    padding: 20,
  },
  dailyChallengeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  dailyChallengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  dailyChallengeInfo: {
    flex: 1,
  },
  dailyChallengeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  dailyChallengeSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  dailyChallengePoints: {
    alignItems: "flex-end",
  },
  dailyChallengePointsText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  dailyChallengeTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  exercisesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  exerciseCardContainer: {
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
  },
  exerciseContent: {
    padding: 20,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  difficultyChip: {
    alignSelf: "flex-start",
  },
  difficultyChipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  premiumChip: {
    borderColor: "#f59e0b",
  },
  premiumText: {
    fontSize: 12,
    color: "#f59e0b",
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
  },
  exerciseStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  exerciseStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  exerciseStatText: {
    fontSize: 12,
    color: "#64748b",
  },
  successRate: {
    fontSize: 12,
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tagChip: {
    backgroundColor: "transparent",
    borderColor: "#334155",
  },
  tagText: {
    fontSize: 12,
    color: "#94a3b8",
  },
  exerciseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submissionsText: {
    fontSize: 14,
    color: "#64748b",
  },
  exerciseButton: {
    borderRadius: 8,
  },
  exerciseButtonText: {
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

export default ExercisesScreen;
