import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Card, FAB, Chip } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
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

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  likes: number;
  timeAgo: string;
  isHot: boolean;
  isSolved: boolean;
}

interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

const categories: Category[] = [
  { id: "all", name: "Tümü", color: COLORS.gray400, count: 45 },
  { id: "general", name: "Genel", color: COLORS.primary, count: 12 },
  { id: "help", name: "Yardım", color: COLORS.success, count: 18 },
  { id: "showcase", name: "Projeler", color: COLORS.warning, count: 8 },
  { id: "discussion", name: "Tartışma", color: COLORS.info, count: 7 },
];

const posts: ForumPost[] = [
  {
    id: "1",
    title: "C++ pointer'lar nasıl çalışır?",
    content:
      "Pointer kavramını tam olarak anlayamadım. Basit bir örnek verebilir misiniz?",
    author: "AhmetY",
    category: "help",
    replies: 8,
    views: 124,
    likes: 5,
    timeAgo: "2s önce",
    isHot: true,
    isSolved: false,
  },
  {
    id: "2",
    title: "İlk C++ projem: Hesap Makinesi",
    content:
      "Temel matematik işlemleri yapan bir hesap makinesi yaptım. Kod incelemeniz için...",
    author: "MeryemK",
    category: "showcase",
    replies: 12,
    views: 89,
    likes: 15,
    timeAgo: "1s önce",
    isHot: false,
    isSolved: false,
  },
  {
    id: "3",
    title: "STL vector vs array performansı",
    content: "Hangi durumlarda vector, hangi durumlarda array kullanmalıyız?",
    author: "DevCan",
    category: "discussion",
    replies: 6,
    views: 67,
    likes: 8,
    timeAgo: "3s önce",
    isHot: false,
    isSolved: true,
  },
  {
    id: "4",
    title: "Compiler error: undefined reference",
    content:
      "Linking sırasında undefined reference hatası alıyorum. Nasıl çözebilirim?",
    author: "NewbieCoder",
    category: "help",
    replies: 4,
    views: 45,
    likes: 2,
    timeAgo: "5s önce",
    isHot: false,
    isSolved: true,
  },
];

const ForumScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const getCategoryColor = (categoryId: string) => {
    return (
      categories.find((cat) => cat.id === categoryId)?.color || COLORS.gray400
    );
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || categoryId;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Forum</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryChips}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && [
                    styles.activeCategoryChip,
                    { backgroundColor: category.color },
                  ],
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category.id &&
                      styles.activeCategoryChipText,
                  ]}
                >
                  {category.name}
                </Text>
                <Text
                  style={[
                    styles.categoryCount,
                    selectedCategory === category.id &&
                      styles.activeCategoryCount,
                  ]}
                >
                  {category.count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Posts List */}
      <ScrollView
        style={styles.postsList}
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
        {filteredPosts.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={styles.postCard}
            activeOpacity={0.7}
          >
            <View style={styles.postHeader}>
              <View style={styles.postMeta}>
                <Chip
                  mode="flat"
                  textStyle={[
                    styles.categoryChipText,
                    { color: getCategoryColor(post.category) },
                  ]}
                  style={[
                    styles.postCategoryChip,
                    { backgroundColor: `${getCategoryColor(post.category)}20` },
                  ]}
                >
                  {getCategoryName(post.category)}
                </Chip>
                {post.isHot && (
                  <View style={styles.hotBadge}>
                    <Ionicons name="flame" size={12} color={COLORS.error} />
                    <Text style={styles.hotText}>Hot</Text>
                  </View>
                )}
                {post.isSolved && (
                  <View style={styles.solvedBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={12}
                      color={COLORS.success}
                    />
                    <Text style={styles.solvedText}>Çözüldü</Text>
                  </View>
                )}
              </View>
              <Text style={styles.postTime}>{post.timeAgo}</Text>
            </View>

            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent} numberOfLines={2}>
              {post.content}
            </Text>

            <View style={styles.postFooter}>
              <View style={styles.postAuthor}>
                <View style={styles.authorAvatar}>
                  <Text style={styles.authorInitial}>
                    {post.author.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.authorName}>{post.author}</Text>
              </View>

              <View style={styles.postStats}>
                <View style={styles.statItem}>
                  <Ionicons
                    name="chatbubble"
                    size={14}
                    color={COLORS.textMuted}
                  />
                  <Text style={styles.statText}>{post.replies}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="eye" size={14} color={COLORS.textMuted} />
                  <Text style={styles.statText}>{post.views}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="heart" size={14} color={COLORS.textMuted} />
                  <Text style={styles.statText}>{post.likes}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredPosts.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="chatbubbles-outline"
              size={64}
              color={COLORS.textMuted}
            />
            <Text style={styles.emptyTitle}>Gönderi bulunamadı</Text>
            <Text style={styles.emptyDescription}>
              Bu kategoride henüz gönderi yok
            </Text>
          </View>
        )}
      </ScrollView>

      {/* New Post FAB */}
      <FAB
        icon="add"
        style={styles.fab}
        onPress={() => {
          // Navigate to new post screen
        }}
      />
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
  filterContainer: {
    paddingBottom: SPACING[4],
  },
  categoryChips: {
    flexDirection: "row",
    paddingHorizontal: SPACING[4],
    gap: SPACING[2],
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[2],
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING[1],
  },
  activeCategoryChip: {
    borderColor: "transparent",
  },
  categoryChipText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
  },
  activeCategoryChipText: {
    color: COLORS.white,
  },
  categoryCount: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textMuted,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING[1],
    borderRadius: RADIUS.sm,
    minWidth: 16,
    textAlign: "center",
  },
  activeCategoryCount: {
    color: COLORS.white,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  postsList: {
    flex: 1,
    paddingHorizontal: SPACING[4],
  },
  postCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    marginBottom: SPACING[3],
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING[2],
  },
  postMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING[2],
    flex: 1,
  },
  postCategoryChip: {
    borderRadius: RADIUS.full,
  },
  hotBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.error}20`,
    paddingHorizontal: SPACING[2],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.full,
    gap: SPACING[1],
  },
  hotText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.error,
  },
  solvedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.success}20`,
    paddingHorizontal: SPACING[2],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.full,
    gap: SPACING[1],
  },
  solvedText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.success,
  },
  postTime: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  postTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING[2],
    lineHeight: TYPOGRAPHY.lineHeight.lg,
  },
  postContent: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
    marginBottom: SPACING[3],
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postAuthor: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING[2],
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  authorInitial: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  authorName: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text,
  },
  postStats: {
    flexDirection: "row",
    gap: SPACING[3],
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING[1],
  },
  statText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  fab: {
    position: "absolute",
    bottom: SPACING[6],
    right: SPACING[4],
    backgroundColor: COLORS.primary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING[12],
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
  },
});

export default ForumScreen;
