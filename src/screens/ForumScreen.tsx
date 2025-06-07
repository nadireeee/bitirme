import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Chip, Button, Avatar, FAB } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
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

const { width, height } = Dimensions.get("window");

const ForumScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      id: "all",
      name: t("forum.categories.all", "Tümü"),
      count: 245,
      icon: "grid",
    },
    { id: "cpp", name: "C++", count: 89, icon: "code-slash" },
    {
      id: "algorithms",
      name: t("forum.categories.algorithms", "Algoritmalar"),
      count: 67,
      icon: "git-branch",
    },
    {
      id: "beginners",
      name: t("forum.categories.beginners", "Başlayanlar"),
      count: 123,
      icon: "school",
    },
    {
      id: "projects",
      name: t("forum.categories.projects", "Projeler"),
      count: 45,
      icon: "folder",
    },
    {
      id: "help",
      name: t("forum.categories.help", "Yardım"),
      count: 78,
      icon: "help-circle",
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
    },
  ];

  const filteredPosts =
    selectedCategory === "all"
      ? forumPosts
      : forumPosts.filter((post) => post.category === selectedCategory);

  const renderPost = (post: any) => (
    <Card key={post.id} style={styles.postCard}>
      <Card.Content>
        <View style={styles.postHeader}>
          <View style={styles.postMeta}>
            <Avatar.Image
              size={isTablet() ? 48 : 40}
              source={{ uri: post.authorAvatar }}
            />
            <View style={styles.postMetaText}>
              <Text style={styles.postAuthor}>{post.author}</Text>
              <Text style={styles.postTime}>{post.timeAgo}</Text>
            </View>
          </View>
          <View style={styles.postActions}>
            {post.isPinned && <Ionicons name="pin" size={16} color="#f59e0b" />}
            {post.isAnswered && (
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            )}
          </View>
        </View>

        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postContent}>{post.content}</Text>

        <View style={styles.postTags}>
          {post.tags.map((tag: string, index: number) => (
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

        <View style={styles.postStats}>
          <View style={styles.stat}>
            <Ionicons name="eye-outline" size={16} color="#64748b" />
            <Text style={styles.statText}>{post.views}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="chatbubble-outline" size={16} color="#64748b" />
            <Text style={styles.statText}>{post.replies}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="heart-outline" size={16} color="#64748b" />
            <Text style={styles.statText}>{post.likes}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <View style={styles.backgroundContainer}>
        <View style={styles.backgroundShape1} />
        <View style={styles.backgroundShape2} />
        <View style={styles.backgroundShape3} />
      </View>

      {/* Header */}
      <LinearGradient colors={["#3b82f6", "#8b5cf6"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {t("forum.title", "Topluluk Forumu")}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t("forum.subtitle", "C ve C++ geliştiricileri ile bilgi paylaşın")}
          </Text>
        </View>
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={t("forum.searchPlaceholder", "Forum'da ara...")}
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === category.id
                      ? "#3b82f6"
                      : colors.surface,
                },
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={selectedCategory === category.id ? "white" : colors.text}
              />
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === category.id ? "white" : colors.text,
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
                        : "#3b82f6",
                  },
                ]}
              >
                <Text style={styles.categoryBadgeText}>{category.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Posts */}
      <ScrollView
        style={styles.postsContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredPosts.map(renderPost)}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={[styles.fab, { backgroundColor: "#3b82f6" }]}
        icon="plus"
        color="white"
        onPress={() => {
          // Navigate to create post screen
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
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
    width: wp(100),
    height: wp(100),
    backgroundColor: "rgba(59, 130, 246, 0.03)",
    borderRadius: wp(50),
    top: -wp(25),
    right: -wp(25),
  },
  backgroundShape2: {
    position: "absolute",
    width: wp(75),
    height: wp(75),
    backgroundColor: "rgba(139, 92, 246, 0.02)",
    borderRadius: wp(37.5),
    top: hp(50),
    right: -wp(30),
  },
  backgroundShape3: {
    position: "absolute",
    width: wp(60),
    height: wp(60),
    backgroundColor: "rgba(16, 185, 129, 0.02)",
    borderRadius: wp(30),
    bottom: hp(20),
    left: -wp(15),
  },
  header: {
    paddingTop: isTablet() ? spacing.xl : spacing.xxl + 20,
    paddingBottom: spacing.xl,
    paddingHorizontal: isSmallPhone()
      ? spacing.lg
      : isTablet()
        ? spacing.xxl
        : spacing.xl,
  },
  headerContent: {
    alignItems: "center",
    maxWidth: isTablet() ? wp(80) : "100%",
    alignSelf: "center",
  },
  headerTitle: {
    fontSize: isSmallPhone()
      ? typography.h3
      : isTablet()
        ? typography.h1
        : typography.h2,
    fontWeight: "700",
    color: "white",
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: isSmallPhone()
      ? typography.body2
      : isTablet()
        ? typography.h6
        : typography.body1,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    maxWidth: isTablet() ? wp(60) : "90%",
  },
  searchContainer: {
    paddingHorizontal: isSmallPhone()
      ? spacing.lg
      : isTablet()
        ? spacing.xxl
        : spacing.xl,
    paddingVertical: spacing.md,
    marginTop: -spacing.md,
    maxWidth: isTablet() ? wp(80) : "100%",
    alignSelf: "center",
    width: "100%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: "#334155",
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.xs,
    fontSize: typography.body1,
  },
  categoriesContainer: {
    paddingLeft: isSmallPhone()
      ? spacing.lg
      : isTablet()
        ? spacing.xxl
        : spacing.xl,
    marginBottom: spacing.sm,
  },
  categoriesContent: {
    paddingRight: isSmallPhone()
      ? spacing.lg
      : isTablet()
        ? spacing.xxl
        : spacing.xl,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.lg,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: "#334155",
  },
  categoryText: {
    fontSize: typography.body2,
    fontWeight: "600",
    marginLeft: spacing.xs,
    marginRight: spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: spacing.xs,
  },
  categoryBadgeText: {
    fontSize: typography.caption,
    color: "white",
    fontWeight: "600",
  },
  postsContainer: {
    flex: 1,
    paddingHorizontal: isSmallPhone()
      ? spacing.lg
      : isTablet()
        ? spacing.xxl
        : spacing.xl,
  },
  postCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: spacing.md,
    marginBottom: spacing.md,
    maxWidth: isTablet() ? wp(80) : "100%",
    alignSelf: "center",
    width: "100%",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  postMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  postMetaText: {
    marginLeft: spacing.sm,
  },
  postAuthor: {
    fontSize: typography.body1,
    fontWeight: "600",
    color: "#f9fafb",
  },
  postTime: {
    fontSize: typography.caption,
    color: "#64748b",
  },
  postActions: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  postTitle: {
    fontSize: isTablet() ? typography.h5 : typography.h6,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: spacing.xs,
    lineHeight: isTablet() ? typography.h5 * 1.3 : typography.h6 * 1.3,
  },
  postContent: {
    fontSize: typography.body2,
    color: "#94a3b8",
    lineHeight: typography.body2 * 1.5,
    marginBottom: spacing.md,
  },
  postTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  tagChip: {
    backgroundColor: "transparent",
    borderColor: "#3b82f6",
  },
  tagText: {
    fontSize: typography.caption,
    color: "#3b82f6",
  },
  postStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    maxWidth: wp(40),
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs / 2,
  },
  statText: {
    fontSize: typography.caption,
    color: "#64748b",
  },
  fab: {
    position: "absolute",
    bottom: isSmallPhone() ? spacing.lg : isTablet() ? spacing.xxl : spacing.xl,
    right: isSmallPhone() ? spacing.lg : isTablet() ? spacing.xxl : spacing.xl,
  },
});

export default ForumScreen;
