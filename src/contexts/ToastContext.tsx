import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react';
import { Animated, StyleSheet, Text, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './ThemeContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback(({ message, type = 'info', duration = 3000 }: ToastOptions) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({ message, type, duration });

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: insets.top + spacing.md,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  }, [insets.top, translateY, opacity]);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast(null);
    });
  }, [translateY, opacity]);

  const insetsRef = useRef(insets);
  insetsRef.current = insets;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy < -5,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy < 0) {
            translateY.setValue(insetsRef.current.top + spacing.md + gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy < -30) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            hideToast();
          } else {
            Animated.spring(translateY, {
              toValue: insetsRef.current.top + spacing.md,
              useNativeDriver: true,
              friction: 8,
            }).start();
          }
        },
      }),
    [translateY, hideToast],
  );

  const getIconName = (type: ToastType) => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'alert-circle';
      default: return 'information-circle';
    }
  };

  const getIconColor = (type: ToastType) => {
    switch (type) {
      case 'success': return colors.success;
      case 'error': return colors.error;
      default: return colors.primary;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.toastContainer,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.borderLight,
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <Ionicons name={getIconName(toast.type || 'info')} size={24} color={getIconColor(toast.type || 'info')} />
          <Text style={[styles.message, { color: colors.text }]}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
    gap: spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
});