import React, { useRef } from 'react';
import { TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme, shadow } from '../theme';

const FloatingButton = ({ onPress }) => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: theme.primary,
            transform: [{ scale: scaleAnim }],
          },
          shadow.large,
        ]}>
        <Icon name="plus" size={28} color="#FFFFFF" />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FloatingButton;
