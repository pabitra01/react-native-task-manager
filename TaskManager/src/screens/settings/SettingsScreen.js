import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import {
  lightTheme,
  darkTheme,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadow,
} from '../../theme';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Settings
        </Text>
      </View>

      {/* User Profile */}
      <View style={[styles.profileCard, { backgroundColor: theme.card }, shadow.medium]}>
        <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
          <Icon name="account" size={32} color={theme.primary} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.text }]}>
            {user?.name || 'User'}
          </Text>
          <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>
      </View>

      {/* Settings List */}
      <View style={styles.settingsSection}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          PREFERENCES
        </Text>

        {/* Dark Mode Toggle */}
        <View
          style={[
            styles.settingItem,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: theme.primaryLight }]}>
              <Icon
                name={themeMode === 'dark' ? 'moon-waning-crescent' : 'white-balance-sunny'}
                size={20}
                color={theme.primary}
              />
            </View>
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Dark Mode
              </Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                {themeMode === 'dark'
                  ? 'Switch to light theme'
                  : 'Switch to dark theme'}
              </Text>
            </View>
          </View>
          <Switch
            value={themeMode === 'dark'}
            onValueChange={() => dispatch(toggleTheme())}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.settingsSection}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          ACCOUNT
        </Text>

        <TouchableOpacity
          style={[
            styles.settingItem,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={handleLogout}
          activeOpacity={0.7}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: '#FEE2E2' }]}>
              <Icon name="logout" size={20} color={theme.danger} />
            </View>
            <View>
              <Text style={[styles.settingLabel, { color: theme.danger }]}>
                Logout
              </Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Sign out of your account
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: theme.textSecondary }]}>
          Task Manager v1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.base,
    marginTop: spacing.lg,
    padding: spacing.base,
    borderRadius: borderRadius.sm,
    gap: spacing.base,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.semibold,
  },
  profileEmail: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.normal,
    marginTop: spacing.xs,
  },
  settingsSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  sectionTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
  },
  settingDesc: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.normal,
    marginTop: 2,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: spacing.xxl,
  },
  versionText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.normal,
  },
});

export default SettingsScreen;
