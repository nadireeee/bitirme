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
      timeAgo: "4 saat önce",
      isAnswered: false,
      isPinned: true,
    },
    {
      id: 3,
      title: "Pointer vs Reference - Ne zaman hangisini kullanmalı?",
      content:
        "C++ da pointer ve reference arasındaki farkları ve hangi durumlarda hangisini kullanmamız gerektiğini açıklayabilir misiniz?",
      author: "LearnCoding",
      authorAvatar: "https://i.pravatar.cc/100?img=4",
      category: "beginners",
      tags: ["pointers", "references", "basics"],
      views: 234,
      replies: 18,
      likes: 41,
      timeAgo: "6 saat önce",
      isAnswered: true,
      isPinned: false,
    },
    {
      id: 4,
      title: "Oyun geliştirme projesi - takım arkadaşı arıyorum",
      content:
        "C++ ile 2D platform oyunu geliştiriyorum. SFML kullanan ve birlikte çalışmak isteyen var mı?",
      author: "GameDev2024",
      authorAvatar: "https://i.pravatar.cc/100?img=5",
      category: "projects",
      tags: ["game-dev", "sfml", "collaboration"],
      views: 67,
      replies: 9,
      likes: 12,
      timeAgo: "8 saat önce",
      isAnswered: false,
      isPinned: false,
    },
    {
      id: 5,
      title: "Memory leak nasıl tespit edilir?",
      content:
        "Programımda memory leak olduğunu fark ettim ama nerede olduğunu bulamıyorum. Hangi araçları kullanabilirim?",
      author: "DebugMaster",
      authorAvatar: "https://i.pravatar.cc/100?img=6",
      category: "help",
      tags: ["memory", "debugging", "tools"],
      views: 145,
      replies: 14,
      likes: 28,
      timeAgo: "1 gün önce",
      isAnswered: true,
      isPinned: false,
    },
  ];

  const filteredPosts = forumPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (categoryId: string) => {
    const colorMap = {
      cpp: colors.primary,
      algorithms: colors.secondary,
      beginners: colors.success,
      projects: colors.warning,
      help: colors.error,
    };
    return colorMap[categoryId] || colors.textSecondary;
  };

  const getTimeAgoColor = (timeAgo: string) => {
    if (timeAgo.includes("saat")) return colors.success;
    if (timeAgo.includes("gün")) return colors.warning;
    return colors.textSecondary;
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
            { backgroundColor: `${colors.warning}04` },
          ]}
        />
      </View>

      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {t("forum.title", "Topluluk Forum")}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t(
              "forum.subtitle",
              "Sorularınızı sorun, deneyimlerinizi paylaşın",
            )}
          </Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={t("forum.searchPlaceholder", "Forum'da ara...")}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
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
                    ? colors.primary
                    : colors.card,
              },
              {
                borderColor:
                  selectedCategory === category.id
                    ? colors.primary
                    : colors.border,
              },
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon as any}
              size={16}
              color={
                selectedCategory === category.id
                  ? "white"
                  : colors.textSecondary
              }
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
            <Text
              style={[
                styles.categoryCount,
                {
                  color:
                    selectedCategory === category.id
                      ? "rgba(255,255,255,0.8)"
                      : colors.textSecondary,
                },
              ]}
            >
              {category.count}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Forum Posts */}
      <ScrollView
        style={styles.postsContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredPosts.map((post) => (
          <Card
            key={post.id}
            style={[
              styles.postCard,
              { backgroundColor: colors.card },
              post.isPinned && {
                borderLeftWidth: 4,
                borderLeftColor: colors.warning,
              },
            ]}
          >
            <Card.Content style={styles.postContent}>
              {/* Post Header */}
              <View style={styles.postHeader}>
                <Avatar.Image size={40} source={{ uri: post.authorAvatar }} />
                <View style={styles.postAuthorInfo}>
                  <View style={styles.authorLine}>
                    <Text style={[styles.authorName, { color: colors.text }]}>
                      {post.author}
                    </Text>
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
                  <Text
                    style={[
                      styles.postTime,
                      { color: getTimeAgoColor(post.timeAgo) },
                    ]}
                  >
                    {post.timeAgo}
                  </Text>
                </View>
              </View>

              {/* Post Title */}
              <TouchableOpacity
                style={styles.postTitleContainer}
                onPress={() => {
                  // Navigate to post detail
                }}
              >
                <Text style={[styles.postTitle, { color: colors.text }]}>
                  {post.title}
                </Text>
              </TouchableOpacity>

              {/* Post Content Preview */}
              <Text
                style={[
                  styles.postContentPreview,
                  { color: colors.textSecondary },
                ]}
              >
                {post.content}
              </Text>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                {post.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    mode="outlined"
                    style={[styles.tagChip, { borderColor: colors.border }]}
                    textStyle={[
                      styles.tagText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    #{tag}
                  </Chip>
                ))}
              </View>

              {/* Post Stats */}
              <View style={styles.postStats}>
                <View style={styles.leftStats}>
                  <View style={styles.statItem}>
                    <Ionicons
                      name="eye"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[styles.statText, { color: colors.textSecondary }]}
                    >
                      {post.views}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons
                      name="chatbubble"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[styles.statText, { color: colors.textSecondary }]}
                    >
                      {post.replies}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="heart" size={14} color={colors.error} />
                    <Text
                      style={[styles.statText, { color: colors.textSecondary }]}
                    >
                      {post.likes}
                    </Text>
                  </View>
                </View>
                <Chip
                  mode="outlined"
                  style={[
                    styles.categoryBadge,
                    { borderColor: getCategoryColor(post.category) },
                  ]}
                  textStyle={[
                    styles.categoryBadgeText,
                    { color: getCategoryColor(post.category) },
                  ]}
                >
                  {categories.find((c) => c.id === post.category)?.name ||
                    post.category}
                </Chip>
              </View>
            </Card.Content>
          </Card>
        ))}

        {filteredPosts.length === 0 && (
          <Card style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Card.Content style={styles.emptyContent}>
              <Ionicons name="search" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {t("forum.noResults", "Sonuç bulunamadı")}
              </Text>
              <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                {t(
                  "forum.noResultsDesc",
                  "Arama kriterlerinizi değiştirerek tekrar deneyin",
                )}
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={[styles.fab, { backgroundColor: colors.primary }]}
        icon="plus"
        onPress={() => {
          // Navigate to create post
        }}
      />
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
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: isMobile ? 20 : isTablet ? 40 : 30,
  },
  headerContent: {
    alignItems: "center",
    maxWidth: isTablet ? 600 : "100%",
    alignSelf: "center",
  },
  headerTitle: {
    fontSize: isMobile ? 24 : isTablet ? 32 : 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: isMobile ? 14 : isTablet ? 18 : 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    maxWidth: isTablet ? 500 : "90%",
  },
  searchContainer: {
    paddingHorizontal: isMobile ? 20 : isTablet ? 40 : 30,
    paddingVertical: 15,
    marginTop: -15,
    maxWidth: isTablet ? 600 : "100%",
    alignSelf: "center",
    width: "100%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingLeft: isMobile ? 20 : isTablet ? 40 : 30,
    marginBottom: 10,
  },
  categoriesContent: {
    paddingRight: isMobile ? 20 : isTablet ? 40 : 30,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
    marginRight: 4,
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: "600",
  },
  postsContainer: {
    flex: 1,
    paddingHorizontal: isMobile ? 20 : isTablet ? 40 : 30,
    maxWidth: isTablet ? 900 : "100%",
    alignSelf: isTablet ? "center" : "stretch",
    width: "100%",
  },
  postCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  postContent: {
    paddingVertical: 16,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postAuthorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  authorLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
  },
  postTime: {
    fontSize: 12,
    marginTop: 2,
  },
  postTitleContainer: {
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  postContentPreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  tagChip: {
    backgroundColor: "transparent",
    height: 24,
  },
  tagText: {
    fontSize: 10,
  },
  postStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftStats: {
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
  categoryBadge: {
    backgroundColor: "transparent",
    height: 24,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  emptyCard: {
    marginTop: 50,
    borderRadius: 12,
    elevation: 2,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    bottom: isMobile ? 20 : isTablet ? 40 : 30,
    right: isMobile ? 20 : isTablet ? 40 : 30,
  },
});

export default ForumScreen;
