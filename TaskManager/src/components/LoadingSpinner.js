import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Animated, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '../theme';

const LoadingSpinner = ({ visible = true }) => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, fadeAnim]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={[styles.backdrop]}>
        <View style={[styles.spinnerBox, { backgroundColor: theme.card }]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingSpinner;
