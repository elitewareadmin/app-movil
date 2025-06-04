import React from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Platform
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import GlassmorphicCard from '../ui/GlassmorphicCard';
import Typography from '../ui/Typography';
import Colors from '@/constants/Colors';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = Platform.OS === 'web' && width > 768 
  ? (width - 80) / 3 
  : (width - 48) / 2;

export function ProductCard({ 
  product, 
  onPress, 
  onAddToWishlist 
}: ProductCardProps) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPress(product)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <GlassmorphicCard style={styles.card}>
          <Image 
            source={{ uri: product.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.content}>
            <View style={styles.brandContainer}>
              <Typography variant="overline" color={Colors.gold.primary}>
                {product.brand}
              </Typography>
              <TouchableOpacity 
                style={styles.wishlistButton}
                onPress={() => onAddToWishlist(product)}
              >
                <Heart 
                  size={18} 
                  color={product.inWishlist ? Colors.roseGold.primary : Colors.dark.secondaryText} 
                  fill={product.inWishlist ? Colors.roseGold.primary : 'transparent'}
                />
              </TouchableOpacity>
            </View>
            <Typography variant="subtitle2" numberOfLines={1}>
              {product.name}
            </Typography>
            <Typography variant="body2" color={Colors.dark.secondaryText} numberOfLines={1}>
              {product.category}
            </Typography>
            <Typography variant="subtitle1" color={Colors.gold.primary} style={styles.price}>
              ${product.price.toFixed(2)}
            </Typography>
          </View>
        </GlassmorphicCard>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    margin: 8,
  },
  card: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
  },
  image: {
    width: '100%',
    height: cardWidth * 1.2,
    borderRadius: 12,
  },
  content: {
    padding: 12,
  },
  brandContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  wishlistButton: {
    padding: 4,
  },
  price: {
    marginTop: 8,
  },
});

export default ProductCard;