import React from 'react';
import { StyleSheet, View, ViewStyle, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';

interface GlassmorphicCardProps extends ViewProps {
  style?: ViewStyle;
  intensity?: number;
  tint?: 'dark' | 'light' | 'default';
}

export function GlassmorphicCard({
  children,
  style,
  intensity = 50,
  tint = 'dark',
  ...props
}: GlassmorphicCardProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <BlurView intensity={intensity} tint={tint} style={styles.blurView}>
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  blurView: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default GlassmorphicCard;