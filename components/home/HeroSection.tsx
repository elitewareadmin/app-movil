import React from 'react';
import { StyleSheet, View, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import Colors from '@/constants/Colors';

interface HeroSectionProps {
  onExplorePress: () => void;
}

const { width, height } = Dimensions.get('window');

export function HeroSection({ onExplorePress }: HeroSectionProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/949670/pexels-photo-949670.jpeg' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(18, 18, 18, 0.3)', 'rgba(18, 18, 18, 0.9)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Typography variant="h1" style={styles.title}>
              Meta
              <Typography variant="h1" color={Colors.gold.primary}>
                Fashion
              </Typography>
            </Typography>
            <Typography 
              variant="subtitle1" 
              color={Colors.dark.secondaryText}
              style={styles.subtitle}
            >
              Experience luxury fashion in immersive reality
            </Typography>
            <Button
              title="Explore Collection"
              variant="gradient"
              icon={<ChevronRight size={20} color={Colors.dark.background} />}
              iconPosition="right"
              onPress={onExplorePress}
              style={styles.button}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.7,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    padding: 24,
  },
  content: {
    marginBottom: 48,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  button: {
    alignSelf: 'flex-start',
  },
});

export default HeroSection;