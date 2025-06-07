import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { Card, Button, Divider } from "react-native-paper";
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

interface UserProfile {
  name: string;
  email: string;
  level: string;
  joinDate: string;
  avatar?: string;
}

interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  streakCount: number;
  totalPoints: number;
  completedCourses: number;
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const [activeTab, setActiveTab] = useState<"profile" | "stats" | "settings">(
    "profile",
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const [userProfile] = useState<UserProfile>({
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    level: "Orta Seviye",
    joinDate: "15 Ocak 2024",
  });

  const [userStats] = useState<UserStats>({
    totalQuizzes: 12,
    averageScore: 85,
    streakCount: 5,
    totalPoints: 1240,
    completedCourses: 3,
  });

  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkmak istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: () => {
            // Handle logout logic
            navigation.navigate("Login" as any);
          },
        },
      ],
    );
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "tr" ? "en" : "tr";
    i18n.changeLanguage(newLang);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <View style={styles.tabContent}>
            {/* Profile Info */}
            <Card style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={40} color={COLORS.white} />
                  </View>
                  <TouchableOpacity style={styles.editAvatarButton}>
                    <Ionicons name="camera" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{userProfile.name}</Text>
                  <Text style={styles.profileEmail}>{userProfile.email}</Text>
                  <Text style={styles.profileLevel}>{userProfile.level}</Text>
                </View>
              </View>
            </Card>

            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatNumber}>
                  {userStats.totalQuizzes}
                </Text>
                <Text style={styles.quickStatLabel}>Quiz</Text>
              </View>
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatNumber}>
                  {userStats.averageScore}%
                </Text>
                <Text style={styles.quickStatLabel}>Başarı</Text>
              </View>
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatNumber}>
                  {userStats.streakCount}
                </Text>
                <Text style={styles.quickStatLabel}>Seri</Text>
              </View>
            </View>

            {/* Profile Actions */}
            <View style={styles.profileActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.actionButtonText}>Profili Düzenle</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons
                  name="shield-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.actionButtonText}>Gizlilik</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.actionButtonText}>Yardım & Destek</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        );

      case "stats":
        return (
          <View style={styles.tabContent}>
            {/* Detailed Stats */}
            <Card style={styles.statsCard}>
              <View style={styles.statsHeader}>
                <Text style={styles.statsTitle}>İstatistikler</Text>
                <TouchableOpacity>
                  <Text style={styles.viewDetailsText}>Detaylar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: COLORS.primary },
                    ]}
                  >
                    <Ionicons name="trophy" size={20} color={COLORS.white} />
                  </View>
                  <Text style={styles.statValue}>{userStats.totalPoints}</Text>
                  <Text style={styles.statLabel}>Toplam Puan</Text>
                </View>

                <View style={styles.statItem}>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: COLORS.success },
                    ]}
                  >
                    <Ionicons name="book" size={20} color={COLORS.white} />
                  </View>
                  <Text style={styles.statValue}>
                    {userStats.completedCourses}
                  </Text>
                  <Text style={styles.statLabel}>Tamamlanan Kurs</Text>
                </View>

                <View style={styles.statItem}>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: COLORS.warning },
                    ]}
                  >
                    <Ionicons name="flame" size={20} color={COLORS.white} />
                  </View>
                  <Text style={styles.statValue}>{userStats.streakCount}</Text>
                  <Text style={styles.statLabel}>En Uzun Seri</Text>
                </View>

                <View style={styles.statItem}>
                  <View
                    style={[styles.statIcon, { backgroundColor: COLORS.info }]}
                  >
                    <Ionicons name="star" size={20} color={COLORS.white} />
                  </View>
                  <Text style={styles.statValue}>
                    {userStats.averageScore}%
                  </Text>
                  <Text style={styles.statLabel}>Ortalama Başarı</Text>
                </View>
              </View>
            </Card>

            {/* Recent Achievements */}
            <Card style={styles.achievementsCard}>
              <Text style={styles.achievementsTitle}>Son Başarılar</Text>
              <View style={styles.achievementsList}>
                {[
                  {
                    icon: "medal",
                    title: "İlk Quiz",
                    desc: "İlk quizinizi tamamladınız",
                    color: COLORS.warning,
                  },
                  {
                    icon: "star",
                    title: "Mükemmel Puan",
                    desc: "100% puan aldınız",
                    color: COLORS.success,
                  },
                  {
                    icon: "flash",
                    title: "Hız Şampiyonu",
                    desc: "Hızlı quiz çözdünüz",
                    color: COLORS.info,
                  },
                ].map((achievement, index) => (
                  <View key={index} style={styles.achievementItem}>
                    <View
                      style={[
                        styles.achievementIcon,
                        { backgroundColor: achievement.color },
                      ]}
                    >
                      <Ionicons
                        name={achievement.icon as any}
                        size={16}
                        color={COLORS.white}
                      />
                    </View>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementTitle}>
                        {achievement.title}
                      </Text>
                      <Text style={styles.achievementDesc}>
                        {achievement.desc}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        );

      case "settings":
        return (
          <View style={styles.tabContent}>
            {/* App Settings */}
            <Card style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>Uygulama</Text>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="moon" size={20} color={COLORS.primary} />
                  <Text style={styles.settingLabel}>Karanlık Mod</Text>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
                  trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>

              <Divider style={styles.settingDivider} />

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons
                    name="notifications"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.settingLabel}>Bildirimler</Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>

              <Divider style={styles.settingDivider} />

              <TouchableOpacity
                style={styles.settingItem}
                onPress={toggleLanguage}
              >
                <View style={styles.settingInfo}>
                  <Ionicons name="language" size={20} color={COLORS.primary} />
                  <Text style={styles.settingLabel}>Dil</Text>
                </View>
                <View style={styles.settingValue}>
                  <Text style={styles.settingValueText}>
                    {i18n.language === "tr" ? "Türkçe" : "English"}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={COLORS.textSecondary}
                  />
                </View>
              </TouchableOpacity>
            </Card>

            {/* Account Settings */}
            <Card style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>Hesap</Text>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="key" size={20} color={COLORS.primary} />
                  <Text style={styles.settingLabel}>Şifre Değiştir</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              <Divider style={styles.settingDivider} />

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="download" size={20} color={COLORS.primary} />
                  <Text style={styles.settingLabel}>Verileri İndir</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              <Divider style={styles.settingDivider} />

              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleLogout}
              >
                <View style={styles.settingInfo}>
                  <Ionicons name="log-out" size={20} color={COLORS.error} />
                  <Text style={[styles.settingLabel, { color: COLORS.error }]}>
                    Çıkış Yap
                  </Text>
                </View>
              </TouchableOpacity>
            </Card>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {[
          { key: "profile", label: "Profil", icon: "person" },
          { key: "stats", label: "İstatistik", icon: "bar-chart" },
          { key: "settings", label: "Ayarlar", icon: "settings" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              activeTab === tab.key && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={
                activeTab === tab.key ? COLORS.primary : COLORS.textSecondary
              }
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab.key && styles.activeTabButtonText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[8],
    paddingBottom: SPACING[4],
  },
  headerTitle: {
    fontSize: TYPOGRAPHY["2xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  placeholder: {
    width: 24,
  },
  tabNavigation: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING[4],
    borderRadius: RADIUS.lg,
    padding: SPACING[1],
    marginBottom: SPACING[4],
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING[3],
    borderRadius: RADIUS.base,
    gap: SPACING[2],
  },
  activeTabButton: {
    backgroundColor: COLORS.background,
    ...SHADOWS.sm,
  },
  tabButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
  },
  activeTabButtonText: {
    color: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: SPACING[4],
    paddingBottom: SPACING[8],
  },

  // Profile Tab Styles
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING[5],
    marginBottom: SPACING[4],
    ...SHADOWS.sm,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: SPACING[4],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING[1],
  },
  profileEmail: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING[1],
  },
  profileLevel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  quickStats: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    marginBottom: SPACING[4],
    ...SHADOWS.sm,
  },
  quickStatItem: {
    flex: 1,
    alignItems: "center",
  },
  quickStatNumber: {
    fontSize: TYPOGRAPHY["2xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING[1],
  },
  quickStatLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  profileActions: {
    gap: SPACING[1],
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    gap: SPACING[3],
  },
  actionButtonText: {
    flex: 1,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text,
  },

  // Stats Tab Styles
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING[5],
    marginBottom: SPACING[4],
    ...SHADOWS.sm,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING[4],
  },
  statsTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  viewDetailsText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING[4],
  },
  statItem: {
    width: (wp(100) - SPACING[4] * 2 - SPACING[5] * 2 - SPACING[4]) / 2,
    alignItems: "center",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING[2],
  },
  statValue: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING[1],
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  achievementsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING[5],
    ...SHADOWS.sm,
  },
  achievementsTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING[4],
  },
  achievementsList: {
    gap: SPACING[3],
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  achievementIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING[3],
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text,
    marginBottom: SPACING[1],
  },
  achievementDesc: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },

  // Settings Tab Styles
  settingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING[5],
    marginBottom: SPACING[4],
    ...SHADOWS.sm,
  },
  settingsTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING[4],
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING[3],
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING[3],
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text,
  },
  settingValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING[2],
  },
  settingValueText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
  },
  settingDivider: {
    backgroundColor: COLORS.border,
    marginVertical: SPACING[2],
  },
});

export default ProfileScreen;
