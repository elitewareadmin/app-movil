import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import HeroSection from '@/components/home/HeroSection';
import FeaturedBrands from '@/components/home/FeaturedBrands';
import ShowroomEntry from '@/components/webxr/ShowroomEntry';
import ProductCard from '@/components/product/ProductCard';
import Typography from '@/components/ui/Typography';
import Colors from '@/constants/Colors';
import { brands } from '@/data/brands';
import { products } from '@/data/products';
import { Product } from '@/types/product';
import { Brand } from '@/types/brand';

export default function HomeScreen() {
  const router = useRouter();
  const [featuredProducts] = useState(products.slice(0, 4));
  
  const handleExplorePress = () => {
    router.push('/catalog');
  };
  
  const handleProductPress = (product: Product) => {
    // Navigate to product detail (would implement in a full app)
    console.log('Product pressed:', product.name);
  };
  
  const handleAddToWishlist = (product: Product) => {
    // Add to wishlist functionality (would implement in a full app)
    console.log('Add to wishlist:', product.name);
  };
  
  const handleBrandPress = (brand: Brand) => {
    // Navigate to brand page (would implement in a full app)
    console.log('Brand pressed:', brand.name);
  };
  
  const handleEnterShowroom = () => {
    router.push('/showroom');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection onExplorePress={handleExplorePress} />
        
        <View style={styles.content}>
          <FeaturedBrands
            brands={brands}
            onBrandPress={handleBrandPress}
          />
          
          <Typography variant="h3" style={styles.sectionTitle}>
            Featured Products
          </Typography>
          
          <View style={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={handleProductPress}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </View>
          
          <ShowroomEntry onEnterShowroom={handleEnterShowroom} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  sectionTitle: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
    ...Platform.select({
      web: {
        maxWidth: 1200,
        alignSelf: 'center',
      },
    }),
  },
});