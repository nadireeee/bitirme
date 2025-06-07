import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Chip, Button, Avatar, FAB } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
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

// Direct colors object to avoid context issues
const colors = {
  background: "#030712",
  surface: "#0f172a",
  text: "#f9fafb",
  textSecondary: "#94a3b8",
  outline: "#334155",
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  border: "#1e293b",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  card: "#0f172a",
};

const ForumScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      id: "all",
      name: "Tümü",
      count: 245,
      icon: "grid",
      color: colors.primary,
    },
    {
      id: "cpp",
      name: "C++",
      count: 89,
      icon: "code-slash",
      color: colors.secondary,
    },
    {
      id: "algorithms",
      name: "Algoritmalar",
      count: 67,
      icon: "git-branch",
      color: colors.success,
    },
    {
      id: "beginners",
      name: "Başlayanlar",
      count: 123,
      icon: "school",
      color: colors.warning,
    },
    {
      id: "projects",
      name: "Projeler",
      count: 45,
      icon: "folder",
      color: colors.error,
    },
    {
      id: "help",
      name: "Yardım",
      count: 78,
      icon: "help-circle",
      color: colors.primary,
    },
  ];

  const forumPosts = [
    {
      id: 1,
      title: "C++ vector container nasıl optimize edilir?",
      content:
        "Büyük veri setleri ile çalışırken vector performansını artırmanın yolları nelerdir?",
      author: "AhmetDev",
      authorAvatar: "https://i.pravatar.cc/100?img=2",
      category: "cpp",
      tags: ["vector", "performance", "optimization"],
      views: 156,
      replies: 12,
      likes: 23,
      timeAgo: "2 saat önce",
      isAnswered: true,
      isPinned: false,
      difficulty: "Orta",
    },
    {
      id: 2,
      title: "Binary Search Tree implementasyonu - kod review",
      content:
        "BST implementasyonumu gözden geçirir misiniz? Insert ve delete fonksiyonlarında sorun olabilir.",
      author: "CodeNewbie",
      authorAvatar: "https://i.pravatar.cc/100?img=3",
      category: "algorithms",
      tags: ["bst", "data-structures", "code-review"],
      views: 89,
      replies: 7,
      likes: 15,
      timeAgo: "5 saat önce",
      isAnswered: false,
      isPinned: true,
      difficulty: "İleri",
    },
    {
      id: 3,
      title: "C programlamaya yeni başladım, hangi IDE önerirsiniz?",
      content:
        "C öğrenmeye yeni başladım. Visual Studio Code mu yoksa başka bir IDE mi kullanmalıyım?",
      author: "YeniOgrenci",
      authorAvatar: "https://i.pravatar.cc/100?img=4",
      category: "beginners",
      tags: ["ide", "tools", "beginner"],
      views: 234,
      replies: 18,
      likes: 45,
      timeAgo: "1 gün önce",
      isAnswered: true,
      isPinned: false,
      difficulty: "Başlangıç",
    },
  ];

  const filteredPosts =
    selectedCategory === "all"
      ? forumPosts
      : forumPosts.filter((post) => post.category === selectedCategory);

  const renderCategoryChip = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryChip,
        {
          backgroundColor:
            selectedCategory === category.id ? category.color : colors.surface,
          borderColor: category.color,
        },
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons
        name={category.icon as any}
        size={16}
        color={selectedCategory === category.id ? "white" : category.color}
      />
      <Text
        style={[
          styles.categoryText,
          {
            color: selectedCategory === category.id ? "white" : category.color,
          },
        ]}
      >
        {category.name}
      </Text>
      <View
        style={[
          styles.categoryBadge,
          {
            backgroundColor:
              selectedCategory === category.id
                ? "rgba(255,255,255,0.2)"
                : `${category.color}20`,
          },
        ]}
      >
        <Text
          style={[
            styles.categoryBadgeText,
            {
              color:
                selectedCategory === category.id ? "white" : category.color,
            },
          ]}
        >
          {category.count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Başlangıç":
        return colors.success;
      case "Orta":
        return colors.warning;
      case "İleri":
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const renderPost = (post: any) => (
    <Card key={post.id} style={styles.postCard}>
      <View style={styles.postContent}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.postMeta}>
            <Avatar.Image
              size={isTablet() ? 48 : 40}
              source={{ uri: post.authorAvatar }}
            />
            <View style={styles.postMetaText}>
              <View style={styles.authorRow}>
                <Text style={styles.postAuthor}>{post.author}</Text>
                {post.isPinned && (
                  <Ionicons name="pin" size={14} color={colors.warning} />
                )}
                {post.isAnswered && (
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={colors.success}
                  />
                )}
              </View>
              <Text style={styles.postTime}>{post.timeAgo}</Text>
            </View>
          </View>
          <Chip
            mode="outlined"
            style={[
              styles.difficultyChip,
              { borderColor: getDifficultyColor(post.difficulty) },
            ]}
            textStyle={[
              styles.difficultyText,
              { color: getDifficultyColor(post.difficulty) },
            ]}
          >
            {post.difficulty}
          </Chip>
        </View>

        {/* Post Title & Content */}
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Post", `${post.title} detayları açılacak`)
          }
        >
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent} numberOfLines={2}>
            {post.content}
          </Text>
        </TouchableOpacity>

        {/* Tags */}
        <View style={styles.postTags}>
          {post.tags.slice(0, 3).map((tag: string, index: number) => (
            <Chip
              key={index}
              mode="outlined"
              style={styles.tagChip}
              textStyle={styles.tagText}
            >
              #{tag}
            </Chip>
          ))}
        </View>

        {/* Post Stats */}
        <View style={styles.postStats}>
          <View style={styles.statGroup}>
            <View style={styles.stat}>
              <Ionicons
                name="eye-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.statText}>{post.views}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.statText}>{post.replies}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons
                name="heart-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.statText}>{post.likes}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.replyButton}
            onPress={() =>
              Alert.alert("Yanıtla", "Yanıt yazma ekranı açılacak")
            }
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={16}
              color={colors.primary}
            />
            <Text style={[styles.replyText, { color: colors.primary }]}>
              Yanıtla
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Forum</Text>
        <Text style={styles.headerSubtitle}>
          C ve C++ geliştiricileri ile bilgi paylaş
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Forum'da ara..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.quickStat}>
          <Text style={[styles.quickStatNumber, { color: colors.primary }]}>
            245
          </Text>
          <Text style={styles.quickStatLabel}>Toplam Soru</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={[styles.quickStatNumber, { color: colors.success }]}>
            189
          </Text>
          <Text style={styles.quickStatLabel}>Çözümlenmiş</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={[styles.quickStatNumber, { color: colors.warning }]}>
            56
          </Text>
          <Text style={styles.quickStatLabel}>Aktif Tartışma</Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Kategoriler</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(renderCategoryChip)}
        </ScrollView>
      </View>

      {/* Posts List */}
      <ScrollView
        style={styles.postsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsContent}
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map(renderPost)
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubbles-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyTitle}>Bu kategoride henüz soru yok</Text>
            <Text style={styles.emptyDescription}>
              İlk soruyu sen sor ve tartışmayı başlat!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={[styles.fab, { backgroundColor: colors.primary }]}
        icon="plus"
        color="white"
        onPress={() =>
          Alert.alert("Yeni Soru", "Soru oluşturma ekranı açılacak")
        }
        label="Soru Sor"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: isTablet() ? spacing.xl : spacing.xxl + 20,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: isTablet() ? typography.h1 : typography.h2,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.body1,
    color: colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchBar: {
    ...commonStyles.row,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.body1,
  },
  quickStats: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  quickStat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    padding: spacing.md,
    ...commonStyles.center,
    ...commonStyles.shadow,
  },
  quickStatNumber: {
    fontSize: typography.h5,
    fontWeight: "800",
    marginBottom: spacing.xs / 2,
  },
  quickStatLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  categoriesContainer: {
    marginBottom: spacing.lg,
  },
  categoriesTitle: {
    fontSize: typography.h6,
    fontWeight: "700",
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  categoriesContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryChip: {
    ...commonStyles.row,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.lg,
    borderWidth: 1,
    gap: spacing.xs,
  },
  categoryText: {
    fontSize: typography.body2,
    fontWeight: "600",
  },
  categoryBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: spacing.xs,
    minWidth: 20,
    ...commonStyles.center,
  },
  categoryBadgeText: {
    fontSize: typography.caption,
    fontWeight: "600",
  },
  postsContainer: {
    flex: 1,
  },
  postsContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + 80, // Extra space for FAB
  },
  postCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...commonStyles.shadow,
  },
  postContent: {
    padding: spacing.md,
  },
  postHeader: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    marginBottom: spacing.sm,
  },
  postMeta: {
    ...commonStyles.row,
    flex: 1,
  },
  postMetaText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  authorRow: {
    ...commonStyles.row,
    gap: spacing.xs,
    alignItems: "center",
  },
  postAuthor: {
    fontSize: typography.body1,
    fontWeight: "600",
    color: colors.text,
  },
  postTime: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  difficultyChip: {
    backgroundColor: "transparent",
  },
  difficultyText: {
    fontSize: typography.caption,
    fontWeight: "600",
  },
  postTitle: {
    fontSize: isTablet() ? typography.h5 : typography.h6,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: isTablet() ? typography.h5 * 1.3 : typography.h6 * 1.3,
  },
  postTags: {
    ...commonStyles.row,
    flexWrap: "wrap",
    marginVertical: spacing.sm,
    gap: spacing.xs,
  },
  tagChip: {
    backgroundColor: "transparent",
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: typography.caption,
    color: colors.primary,
  },
  postStats: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statGroup: {
    ...commonStyles.row,
    gap: spacing.md,
  },
  stat: {
    ...commonStyles.row,
    gap: spacing.xs / 2,
    alignItems: "center",
  },
  statText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  replyButton: {
    ...commonStyles.row,
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: spacing.sm,
    gap: spacing.xs / 2,
  },
  replyText: {
    fontSize: typography.caption,
    fontWeight: "600",
  },
  emptyContainer: {
    ...commonStyles.center,
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: typography.h6,
    fontWeight: "600",
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyDescription: {
    fontSize: typography.body2,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
  },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.lg,
  },
});

export default ForumScreen;
