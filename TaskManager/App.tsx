import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/store';
import { loadToken } from './src/store/slices/authSlice';
import { loadTheme } from './src/store/slices/themeSlice';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state: any) => state.theme.mode);

  useEffect(() => {
    dispatch(loadToken() as any);
    dispatch(loadTheme() as any);
  }, [dispatch]);

  return (
    <>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={themeMode === 'dark' ? '#0F172A' : '#F8FAFC'}
        translucent={false}
      />
      <AppNavigator />
    </>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
