import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme, fontWeight } from '../theme';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OtpScreen from '../screens/auth/OtpScreen';

// Main Screens
import ProjectListScreen from '../screens/projects/ProjectListScreen';
import ProjectDetailScreen from '../screens/projects/ProjectDetailScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

const AuthStackNav = createNativeStackNavigator();
const ProjectStackNav = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

const AuthStack = () => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <AuthStackNav.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}>
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="Signup" component={SignupScreen} />
      <AuthStackNav.Screen name="OTP" component={OtpScreen} />
    </AuthStackNav.Navigator>
  );
};

const ProjectStack = () => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ProjectStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: fontWeight.semibold },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.background },
      }}>
      <ProjectStackNav.Screen
        name="ProjectList"
        component={ProjectListScreen}
        options={{ headerShown: false }}
      />
      <ProjectStackNav.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={({ route }) => ({
          title: route.params?.project?.title || 'Project',
        })}
      />
    </ProjectStackNav.Navigator>
  );
};

const MainTabs = () => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: fontWeight.medium,
        },
      }}>
      <Tab.Screen
        name="ProjectsTab"
        component={ProjectStack}
        options={{
          tabBarLabel: 'Projects',
          tabBarIcon: ({ color, size }) => (
            <Icon name="folder-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, isLoading, token } = useSelector(
    (state) => state.auth,
  );
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const navigationTheme = {
    dark: themeMode === 'dark',
    colors: {
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      notification: theme.primary,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: '700' },
      heavy: { fontFamily: 'System', fontWeight: '900' },
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated && token ? (
          <RootStack.Screen name="Main" component={MainTabs} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
