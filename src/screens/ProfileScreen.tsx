import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  Chip,
  Button,
  Avatar,
  ProgressBar,
  Switch,
  Divider,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
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

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("profile");

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Mock user data
  const user = {
    name: "Kullanıcı",
    email: "kullanici@example.com",
    level: "Orta Seviye",
    joinDate: "Mart 2024",
    coursesCompleted: 3,
    exercisesSolved: 45,
    totalPoints: 1250,
    currentStreak: 7,
    avatar: "https://i.pravatar.cc/150?img=1",
  };

  const achievements = [
    {
      id: 1,
      title: "İlk Kurs",
      description: "İlk kursunu tamamladın",
      icon: "school",
      earned: true,
      color: colors.success,
    },
    {
      id: 2,
      title: "Hızlı Öğrenci",
      description: "24 saatte 10 alıştırma çözdün",
      icon: "flash",
      earned: true,
      color: colors.warning,
    },
    {
      id: 3,
      title: "Sosyal",
      description: "Forum'da 5 soru cevapladın",
      icon: "chatbubbles",
      earned: false,
      color: colors.primary,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      title: "C++ OOP kursu tamamlandı",
      type: "course",
      time: "2 saat önce",
      points: 50,
    },
    {
      id: 2,
      title: "Pointer alıştırması çözüldü",
      type: "exercise",
      time: "1 gün önce",
      points: 15,
    },
    {
      id: 3,
      title: "Forum'da soru soruldu",
      type: "forum",
      time: "2 gün önce",
      points: 5,
    },
  ];

  const settingsMenu = [
    {
      section: "Hesap",
      items: [
        {
          title: "Profil Bilgileri",
          subtitle: "Adın, email ve diğer bilgiler",
          icon: "person",
          action: () =>
            Alert.alert("Profil", "Profil düzenleme ekranı açılacak"),
        },
        {
          title: "Şifre Değiştir",
          subtitle: "Hesap güvenliğin için şifreni güncelle",
          icon: "lock-closed",
          action: () =>
            Alert.alert("Şifre", "Şifre değiştirme ekranı açılacak"),
        },
        {
          title: "Bildirim Ayarları",
          subtitle: "Push bildirimi tercihlerin",
          icon: "notifications",
          action: () =>
            Alert.alert("Bildirimler", "Bildirim ayarları açılacak"),
        },
      ],
    },
    {
      section: "Uygulama",
      items: [
        {
          title: "Koyu Mod",
          subtitle: "Gece modu açık/kapalı",
          icon: "moon",
          action: toggleTheme,
          showSwitch: true,
          switchValue: isDarkMode,
        },
        {
          title: "Dil",
          subtitle: `Şu anki dil: ${currentLanguage === "tr" ? "Türkçe" : "English"}`,
          icon: "language",
          action: () => Alert.alert("Dil", "Dil seçimi yapılacak"),
        },
        {
          title: "Önbellek Temizle",
          subtitle: "Uygulamanın önbelleğini temizle",
          icon: "trash",
          action: () => Alert.alert("Önbellek", "Önbellek temizlenecek"),
        },
      ],
    },
    {
      section: "Yardım",
      items: [
        {
          title: "Yardım Merkezi",
          subtitle: "SSS ve yardım makaleleri",
          icon: "help-circle",
          action: () => Alert.alert("Yardım", "Yardım merkezi açılacak"),
        },
        {
          title: "Geri Bildirim",
          subtitle: "Önerilerinizi bizimle paylaşın",
          icon: "chatbubble-ellipses",
          action: () =>
            Alert.alert("Geri Bildirim", "Geri bildirim formu açılacak"),
        },
        {
          title: "Hakkında",
          subtitle: "Uygulama bilgileri ve sürüm",
          icon: "information-circle",
          action: () => Alert.alert("Hakkında", "CodeMentor AI v1.0.0"),
        },
      ],
    },
  ];

  const tabs = [
    { id: "profile", title: "Profil", icon: "person" },
    { id: "achievements", title: "Başarılar", icon: "trophy" },
    { id: "activity", title: "Aktivite", icon: "time" },
    { id: "settings", title: "Ayarlar", icon: "settings" },
  ];

  const renderTab = (tab: any) => (
    <TouchableOpacity
      key={tab.id}
      style={[styles.tab, activeTab === tab.id && styles.activeTab]}
      onPress={() => setActiveTab(tab.id)}
    >
      <Ionicons
        name={tab.icon as any}
        size={18}
        color={activeTab === tab.id ? colors.primary : colors.textSecondary}
      />
      <Text
        style={[
          styles.tabText,
          {
            color: activeTab === tab.id ? colors.primary : colors.textSecondary,
          },
        ]}
      >
        {tab.title}
      </Text>
    </TouchableOpacity>
  );

  const renderProfileContent = () => (
    <View style={styles.content}>
      {/* User Info Card */}
      <Card style={styles.userCard}>
        <View style={styles.userContent}>
          <Avatar.Image
            size={isTablet() ? 100 : 80}
            source={{ uri: user.avatar }}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Chip
              mode="outlined"
              style={[styles.levelChip, { borderColor: colors.primary }]}
              textStyle={[styles.levelText, { color: colors.primary }]}
            >
              {user.level}
            </Chip>
          </View>
        </View>
      </Card>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {user.coursesCompleted}
          </Text>
          <Text style={styles.statLabel}>Tamamlanan Kurs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {user.exercisesSolved}
          </Text>
          <Text style={styles.statLabel}>Çözülen Alıştırma</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {user.totalPoints}
          </Text>
          <Text style={styles.statLabel}>Toplam Puan</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.secondary }]}>
            {user.currentStreak}
          </Text>
          <Text style={styles.statLabel}>Günlük Seri</Text>
        </View>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.content}>
      {achievements.map((achievement) => (
        <Card key={achievement.id} style={styles.achievementCard}>
          <View style={styles.achievementContent}>
            <View
              style={[
                styles.achievementIcon,
                {
                  backgroundColor: achievement.earned
                    ? `${achievement.color}20`
                    : `${colors.border}20`,
                },
              ]}
            >
              <Ionicons
                name={achievement.icon as any}
                size={24}
                color={
                  achievement.earned ? achievement.color : colors.textSecondary
                }
              />
            </View>
            <View style={styles.achievementInfo}>
              <Text
                style={[
                  styles.achievementTitle,
                  {
                    color: achievement.earned
                      ? colors.text
                      : colors.textSecondary,
                  },
                ]}
              >
                {achievement.title}
              </Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
            </View>
            {achievement.earned && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={achievement.color}
              />
            )}
          </View>
        </Card>
      ))}
    </View>
  );

  const renderActivity = () => (
    <View style={styles.content}>
      {recentActivity.map((activity) => (
        <Card key={activity.id} style={styles.activityCard}>
          <View style={styles.activityContent}>
            <View style={styles.activityIcon}>
              <Ionicons
                name={
                  activity.type === "course"
                    ? "book"
                    : activity.type === "exercise"
                      ? "code-slash"
                      : "chatbubbles"
                }
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
            <View style={styles.activityPoints}>
              <Text style={[styles.pointsText, { color: colors.success }]}>
                +{activity.points}
              </Text>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );

  const renderSettings = () => (
    <View style={styles.content}>
      {settingsMenu.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{section.section}</Text>
          <Card style={styles.settingsCard}>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex}>
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={item.action}
                >
                  <View style={styles.settingIcon}>
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                  {item.showSwitch ? (
                    <Switch
                      value={item.switchValue}
                      onValueChange={item.action}
                      color={colors.primary}
                    />
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.textSecondary}
                    />
                  )}
                </TouchableOpacity>
                {itemIndex < section.items.length - 1 && (
                  <Divider style={styles.divider} />
                )}
              </View>
            ))}
          </Card>
        </View>
      ))}

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() =>
          Alert.alert(
            "Çıkış",
            "Hesabınızdan çıkmak istediğinizden emin misiniz?",
            [
              { text: "İptal", style: "cancel" },
              { text: "Çıkış Yap", style: "destructive" },
            ],
          )
        }
      >
        <Ionicons name="log-out" size={20} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>
          Çıkış Yap
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileContent();
      case "achievements":
        return renderAchievements();
      case "activity":
        return renderActivity();
      case "settings":
        return renderSettings();
      default:
        return renderProfileContent();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.headerTitle}>Profil</Text>
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map(renderTab)}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {renderContent()}
        </Animated.View>
      </ScrollView>
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
  },
  tabsContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsContent: {
    paddingHorizontal: spacing.lg,
  },
  tab: {
    ...commonStyles.row,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    gap: spacing.xs,
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.body2,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  content: {
    padding: spacing.lg,
  },
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.lg,
    marginBottom: spacing.lg,
    ...commonStyles.shadow,
  },
  userContent: {
    ...commonStyles.row,
    padding: spacing.lg,
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    fontSize: typography.h4,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  userEmail: {
    fontSize: typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  levelChip: {
    backgroundColor: "transparent",
    alignSelf: "flex-start",
  },
  levelText: {
    fontSize: typography.caption,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  statItem: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    padding: spacing.md,
    width: getCardWidth(2, spacing.lg),
    ...commonStyles.center,
    ...commonStyles.shadow,
  },
  statNumber: {
    fontSize: typography.h4,
    fontWeight: "800",
    marginBottom: spacing.xs / 2,
  },
  statLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  achievementCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    marginBottom: spacing.sm,
    ...commonStyles.shadow,
  },
  achievementContent: {
    ...commonStyles.row,
    padding: spacing.md,
    alignItems: "center",
  },
  achievementIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    ...commonStyles.center,
    marginRight: spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: typography.h6,
    fontWeight: "600",
    marginBottom: spacing.xs / 2,
  },
  achievementDescription: {
    fontSize: typography.body2,
    color: colors.textSecondary,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    marginBottom: spacing.sm,
    ...commonStyles.shadow,
  },
  activityContent: {
    ...commonStyles.row,
    padding: spacing.md,
    alignItems: "center",
  },
  activityIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: `${colors.primary}20`,
    ...commonStyles.center,
    marginRight: spacing.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: typography.body1,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  activityTime: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  activityPoints: {
    backgroundColor: `${colors.success}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: spacing.sm,
  },
  pointsText: {
    fontSize: typography.caption,
    fontWeight: "700",
  },
  settingsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h6,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    ...commonStyles.shadow,
  },
  settingItem: {
    ...commonStyles.row,
    padding: spacing.md,
    alignItems: "center",
  },
  settingIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: `${colors.primary}20`,
    ...commonStyles.center,
    marginRight: spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.body1,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  settingSubtitle: {
    fontSize: typography.body2,
    color: colors.textSecondary,
  },
  divider: {
    backgroundColor: colors.border,
    marginLeft: spacing.lg + wp(10),
  },
  logoutButton: {
    ...commonStyles.row,
    ...commonStyles.center,
    backgroundColor: `${colors.error}10`,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  logoutText: {
    fontSize: typography.body1,
    fontWeight: "600",
  },
});

export default ProfileScreen;
