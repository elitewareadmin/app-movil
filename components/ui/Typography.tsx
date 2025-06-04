import React from 'react';
import { Text, TextStyle, TextProps, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline';
  color?: string;
  style?: TextStyle;
}

export function Typography({
  variant = 'body1',
  color = Colors.dark.text,
  style,
  children,
  ...props
}: TypographyProps) {
  return (
    <Text 
      style={[styles[variant], { color }, style]} 
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32,
    lineHeight: 38,
  },
  h2: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    lineHeight: 34,
  },
  h3: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    lineHeight: 30,
  },
  h4: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 20,
    lineHeight: 26,
  },
  subtitle1: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  subtitle2: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  body1: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  body2: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.25,
  },
  button: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.4,
  },
  overline: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

export default Typography;