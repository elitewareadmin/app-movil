import React from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import GlassmorphicCard from '../ui/GlassmorphicCard';
import Colors from '@/constants/Colors';

interface ShowroomEntryProps {
  onEnterShowroom: () => void;
}

const { width } = Dimensions.get('window');

export function ShowroomEntry({ onEnterShowroom }: ShowroomEntryProps) {
  return (
    <View style={styles.container}>
      <GlassmorphicCard style={styles.card}>
        <LinearGradient
          colors={['rgba(212, 175, 55, 0.2)', 'rgba(183, 110, 121, 0.2)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
        <View style={styles.content}>
          <Sparkles size={48} color={Colors.gold.primary} style={styles.icon} />
          <Typography variant="h2" style={styles.title}>
            Enter MetaCatalog
          </Typography>
          <Typography
            variant="body1"
            color={Colors.dark.secondaryText}
            style={styles.description}
          >
            Experience our exclusive collection in an immersive 3D virtual showroom.
          </Typography>
          <Button
            title="Enter Virtual Showroom"
            variant="gradient"
            size="large"
            onPress={onEnterShowroom}
            style={styles.button}
          />
        </View>
      </GlassmorphicCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  card: {
    overflow: 'hidden',
    borderRadius: 20,
    height: 250,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 500,
    ...Platform.select({
      web: {
        alignSelf: 'center',
      },
    }),
  },
  button: {
    minWidth: 220,
  },
});

export default ShowroomEntry;