import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@TaskManager:token';
const THEME_KEY = '@TaskManager:theme';

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const getThemeMode = async () => {
  try {
    const mode = await AsyncStorage.getItem(THEME_KEY);
    return mode || 'light';
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'light';
  }
};

export const setThemeMode = async (mode) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, mode);
  } catch (error) {
    console.error('Error setting theme:', error);
  }
};
