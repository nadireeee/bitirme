import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import responsive, {
  wp,
  hp,
  typography,
  spacing,
  commonStyles,
  isTablet,
  isSmallPhone,
} from "../../utils/responsive";

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

interface SocialActionsProps {
  itemId: string;
  itemType: "post" | "course" | "exercise" | "video";
  initialLikes?: number;
  initialComments?: number;
  initialShares?: number;
  isLiked?: boolean;
  onLike?: (itemId: string, isLiked: boolean) => void;
  onComment?: (itemId: string, comment: string) => void;
  onShare?: (itemId: string) => void;
  showCounts?: boolean;
  size?: "small" | "medium" | "large";
}

const SocialActions: React.FC<SocialActionsProps> = ({
  itemId,
  itemType,
  initialLikes = 0,
  initialComments = 0,
  initialShares = 0,
  isLiked: initialIsLiked = false,
  onLike,
  onComment,
  onShare,
  showCounts = true,
  size = "medium",
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [shares, setShares] = useState(initialShares);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  // Animation values
  const [likeScale] = useState(new Animated.Value(1));
  const [heartPulse] = useState(new Animated.Value(1));

  // Mock comments data
  const [commentsList, setCommentsList] = useState([
    {
      id: "1",
      user: "AhmetDev",
      avatar: "https://i.pravatar.cc/100?img=1",
      text: "Harika bir paylaşım! Çok yararlı oldu.",
      time: "2 saat önce",
      likes: 5,
    },
    {
      id: "2",
      user: "CodeNewbie",
      avatar: "https://i.pravatar.cc/100?img=2",
      text: "Bu konuyu daha detaylı anlatabilir misiniz?",
      time: "5 saat önce",
      likes: 2,
    },
  ]);

  const getSizeValues = () => {
    switch (size) {
      case "small":
        return {
          iconSize: 16,
          fontSize: typography.caption,
          padding: spacing.xs,
        };
      case "large":
        return {
          iconSize: 24,
          fontSize: typography.body1,
          padding: spacing.md,
        };
      default:
        return {
          iconSize: 20,
          fontSize: typography.body2,
          padding: spacing.sm,
        };
    }
  };

  const { iconSize, fontSize, padding } = getSizeValues();

  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes((prev) => (newIsLiked ? prev + 1 : prev - 1));

    // Animate like button
    Animated.sequence([
      Animated.spring(likeScale, {
        toValue: 1.3,
        useNativeDriver: true,
      }),
      Animated.spring(likeScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    if (newIsLiked) {
      // Heart pulse animation for new likes
      Animated.sequence([
        Animated.timing(heartPulse, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(heartPulse, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }

    onLike?.(itemId, newIsLiked);
  };

  const handleComment = () => {
    setShowCommentModal(true);
  };

  const submitComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now().toString(),
        user: "Ben",
        avatar: "https://i.pravatar.cc/100?img=5",
        text: commentText.trim(),
        time: "Şimdi",
        likes: 0,
      };

      setCommentsList((prev) => [newComment, ...prev]);
      setComments((prev) => prev + 1);
      setCommentText("");
      setShowCommentModal(false);

      onComment?.(itemId, commentText.trim());

      Alert.alert("Başarılı", "Yorumunuz eklendi!");
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const shareAction = (platform: string) => {
    setShares((prev) => prev + 1);
    setShowShareModal(false);
    onShare?.(itemId);

    Alert.alert("Paylaşıldı", `${platform} üzerinden başarıyla paylaşıldı!`, [
      { text: "Tamam" },
    ]);
  };

  const renderCommentModal = () => (
    <Modal
      visible={showCommentModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[styles.modalContainer, { backgroundColor: colors.background }]}
      >
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowCommentModal(false)}>
            <Text
              style={[styles.cancelButton, { color: colors.textSecondary }]}
            >
              İptal
            </Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Yorumlar</Text>
          <TouchableOpacity onPress={submitComment}>
            <Text style={[styles.postButton, { color: colors.primary }]}>
              Gönder
            </Text>
          </TouchableOpacity>
        </View>

        {/* New Comment Input */}
        <View style={styles.newCommentContainer}>
          <Avatar.Image
            size={36}
            source={{ uri: "https://i.pravatar.cc/100?img=5" }}
          />
          <TextInput
            style={styles.commentInput}
            placeholder="Yorumunuzu yazın..."
            placeholderTextColor={colors.textSecondary}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
        </View>

        {/* Comments List */}
        <ScrollView style={styles.commentsList}>
          {commentsList.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Avatar.Image size={32} source={{ uri: comment.avatar }} />
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>{comment.user}</Text>
                  <Text style={styles.commentTime}>{comment.time}</Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
                <View style={styles.commentActions}>
                  <TouchableOpacity style={styles.commentLike}>
                    <Ionicons
                      name="heart-outline"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.commentLikeText}>{comment.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.commentReply}>
                    <Text style={styles.commentReplyText}>Yanıtla</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  const renderShareModal = () => (
    <Modal visible={showShareModal} animationType="slide" transparent>
      <View style={styles.shareModalOverlay}>
        <View style={styles.shareModalContainer}>
          <View style={styles.shareModalHeader}>
            <Text style={styles.shareModalTitle}>Paylaş</Text>
            <TouchableOpacity onPress={() => setShowShareModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.shareOptions}>
            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => shareAction("WhatsApp")}
            >
              <View style={[styles.shareIcon, { backgroundColor: "#25D366" }]}>
                <Ionicons name="logo-whatsapp" size={24} color="white" />
              </View>
              <Text style={styles.shareOptionText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => shareAction("Telegram")}
            >
              <View style={[styles.shareIcon, { backgroundColor: "#0088cc" }]}>
                <Ionicons name="send" size={24} color="white" />
              </View>
              <Text style={styles.shareOptionText}>Telegram</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => shareAction("Twitter")}
            >
              <View style={[styles.shareIcon, { backgroundColor: "#1DA1F2" }]}>
                <Ionicons name="logo-twitter" size={24} color="white" />
              </View>
              <Text style={styles.shareOptionText}>Twitter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => shareAction("Link Kopyala")}
            >
              <View
                style={[styles.shareIcon, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="copy" size={24} color="white" />
              </View>
              <Text style={styles.shareOptionText}>Kopyala</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { padding }]}>
      {/* Like Button */}
      <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
        <Animated.View
          style={[
            styles.actionIcon,
            {
              transform: [{ scale: likeScale }],
            },
          ]}
        >
          <Animated.View
            style={[
              {
                transform: [{ scale: isLiked ? heartPulse : 1 }],
              },
            ]}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={iconSize}
              color={isLiked ? colors.error : colors.textSecondary}
            />
          </Animated.View>
        </Animated.View>
        {showCounts && (
          <Text
            style={[
              styles.actionCount,
              {
                fontSize,
                color: isLiked ? colors.error : colors.textSecondary,
              },
            ]}
          >
            {likes}
          </Text>
        )}
      </TouchableOpacity>

      {/* Comment Button */}
      <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
        <View style={styles.actionIcon}>
          <Ionicons
            name="chatbubble-outline"
            size={iconSize}
            color={colors.textSecondary}
          />
        </View>
        {showCounts && (
          <Text
            style={[
              styles.actionCount,
              { fontSize, color: colors.textSecondary },
            ]}
          >
            {comments}
          </Text>
        )}
      </TouchableOpacity>

      {/* Share Button */}
      <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
        <View style={styles.actionIcon}>
          <Ionicons
            name="share-outline"
            size={iconSize}
            color={colors.textSecondary}
          />
        </View>
        {showCounts && (
          <Text
            style={[
              styles.actionCount,
              { fontSize, color: colors.textSecondary },
            ]}
          >
            {shares}
          </Text>
        )}
      </TouchableOpacity>

      {renderCommentModal()}
      {renderShareModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.row,
    gap: spacing.lg,
    alignItems: "center",
  },
  actionButton: {
    ...commonStyles.row,
    alignItems: "center",
    gap: spacing.xs / 2,
  },
  actionIcon: {
    width: 32,
    height: 32,
    ...commonStyles.center,
    borderRadius: 16,
  },
  actionCount: {
    fontWeight: "600",
    minWidth: 20,
  },
  modalContainer: {
    flex: 1,
    paddingTop: spacing.xxl,
  },
  modalHeader: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelButton: {
    fontSize: typography.body1,
  },
  modalTitle: {
    fontSize: typography.h6,
    fontWeight: "700",
    color: colors.text,
  },
  postButton: {
    fontSize: typography.body1,
    fontWeight: "600",
  },
  newCommentContainer: {
    ...commonStyles.row,
    padding: spacing.lg,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: typography.body1,
    maxHeight: 100,
    textAlignVertical: "top",
  },
  commentsList: {
    flex: 1,
    padding: spacing.lg,
  },
  commentItem: {
    ...commonStyles.row,
    marginBottom: spacing.lg,
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    marginBottom: spacing.xs / 2,
  },
  commentUser: {
    fontSize: typography.body2,
    fontWeight: "600",
    color: colors.text,
  },
  commentTime: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  commentText: {
    fontSize: typography.body2,
    color: colors.text,
    lineHeight: typography.body2 * 1.4,
    marginBottom: spacing.xs,
  },
  commentActions: {
    ...commonStyles.row,
    gap: spacing.md,
  },
  commentLike: {
    ...commonStyles.row,
    gap: spacing.xs / 2,
  },
  commentLikeText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  commentReply: {},
  commentReplyText: {
    fontSize: typography.caption,
    color: colors.primary,
    fontWeight: "600",
  },
  shareModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  shareModalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: spacing.lg,
    borderTopRightRadius: spacing.lg,
    paddingBottom: spacing.xl,
  },
  shareModalHeader: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  shareModalTitle: {
    fontSize: typography.h6,
    fontWeight: "700",
    color: colors.text,
  },
  shareOptions: {
    ...commonStyles.row,
    padding: spacing.lg,
    gap: spacing.lg,
    justifyContent: "space-around",
  },
  shareOption: {
    alignItems: "center",
    gap: spacing.sm,
  },
  shareIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    ...commonStyles.center,
  },
  shareOptionText: {
    fontSize: typography.caption,
    color: colors.text,
    fontWeight: "600",
  },
});

export default SocialActions;
