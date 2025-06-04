import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import Typography from '../ui/Typography';
import Colors from '@/constants/Colors';
import { Brand } from '@/types/brand';

interface FeaturedBrandsProps {
  brands: Brand[];
  onBrandPress: (brand: Brand) => void;
}

export function FeaturedBrands({ brands, onBrandPress }: FeaturedBrandsProps) {
  return (
    <View style={styles.container}>
      <Typography variant="h3" style={styles.sectionTitle}>
        Featured Brands
      </Typography>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {brands.map((brand) => (
          <TouchableOpacity
            key={brand.id}
            style={styles.brandContainer}
            onPress={() => onBrandPress(brand)}
            activeOpacity={0.8}
          >
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: brand.logoUrl }}
                style={styles.brandLogo}
                resizeMode="contain"
              />
            </View>
            <Typography variant="subtitle2" style={styles.brandName}>
              {brand.name}
            </Typography>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  brandContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 100,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.dark.divider,
  },
  brandLogo: {
    width: 60,
    height: 60,
  },
  brandName: {
    textAlign: 'center',
  },
});

export default FeaturedBrands;