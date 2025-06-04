import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Platform
} from 'react-native';
import { Camera, Check, RefreshCw, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import Colors from '@/constants/Colors';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { products } from '@/data/products';

export default function FittingRoomScreen() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [cameraActive, setCameraActive] = useState(false);
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  
  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
  };
  
  const toggleCamera = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    setCameraActive(!cameraActive);
  };
  
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };
  
  const handleShare = () => {
    // Share functionality (would implement in a full app)
    console.log('Share pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" style={styles.title}>
          Virtual Fitting Room
        </Typography>
        <Typography variant="body2" color={Colors.dark.secondaryText}>
          Try on items with AR technology
        </Typography>
      </View>
      
      <View style={styles.mainContent}>
        {cameraActive && permission?.granted ? (
          <View style={styles.cameraContainer}>
            <CameraView 
              style={styles.camera} 
              facing={facing}
            >
              <LinearGradient
                colors={['rgba(18, 18, 18, 0.7)', 'transparent', 'rgba(18, 18, 18, 0.7)']}
                style={styles.cameraGradient}
              />
              
              <View style={styles.cameraControls}>
                <TouchableOpacity 
                  style={styles.cameraButton} 
                  onPress={toggleCameraFacing}
                >
                  <RefreshCw size={24} color={Colors.dark.text} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.cameraButton, styles.mainCameraButton]} 
                  onPress={toggleCamera}
                >
                  <Check size={28} color={Colors.dark.text} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.cameraButton} 
                  onPress={handleShare}
                >
                  <Share2 size={24} color={Colors.dark.text} />
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
        ) : (
          <GlassmorphicCard style={styles.tryOnCard}>
            <Image
              source={{ uri: selectedProduct.imageUrl }}
              style={styles.productImage}
              resizeMode="contain"
            />
            <View style={styles.productInfo}>
              <Typography variant="h3" style={styles.productName}>
                {selectedProduct.name}
              </Typography>
              <Typography variant="subtitle2" color={Colors.gold.primary}>
                {selectedProduct.brand}
              </Typography>
              <Typography variant="body2" color={Colors.dark.secondaryText} style={styles.productDescription}>
                {selectedProduct.description}
              </Typography>
              <View style={styles.priceContainer}>
                <Typography variant="subtitle1" color={Colors.gold.primary}>
                  ${selectedProduct.price.toFixed(2)}
                </Typography>
              </View>
              <Button
                title="Try On With Camera"
                variant="gradient"
                icon={<Camera size={20} color={Colors.dark.background} />}
                onPress={toggleCamera}
                style={styles.tryOnButton}
              />
            </View>
          </GlassmorphicCard>
        )}
      </View>
      
      <View style={styles.productsListContainer}>
        <Typography variant="subtitle1" style={styles.sectionTitle}>
          Available Items
        </Typography>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
        >
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[
                styles.productItem,
                selectedProduct.id === product.id && styles.selectedProductItem
              ]}
              onPress={() => handleSelectProduct(product)}
            >
              <Image
                source={{ uri: product.imageUrl }}
                style={styles.productItemImage}
                resizeMode="cover"
              />
              {selectedProduct.id === product.id && (
                <LinearGradient
                  colors={[Colors.gold.primary, Colors.roseGold.primary]}
                  style={styles.selectedIndicator}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 4,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  tryOnCard: {
    flex: 1,
    flexDirection: Platform.OS === 'web' && Platform.windowWidth > 768 ? 'row' : 'column',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 300,
    ...Platform.select({
      web: {
        flex: Platform.windowWidth > 768 ? 1 : undefined,
      },
    }),
  },
  productInfo: {
    padding: 16,
    ...Platform.select({
      web: {
        flex: Platform.windowWidth > 768 ? 1 : undefined,
      },
    }),
  },
  productName: {
    marginBottom: 4,
  },
  productDescription: {
    marginTop: 12,
    marginBottom: 16,
  },
  priceContainer: {
    marginBottom: 20,
  },
  tryOnButton: {
    marginTop: 8,
  },
  productsListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  productsList: {
    paddingBottom: 8,
  },
  productItem: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.dark.divider,
  },
  selectedProductItem: {
    borderColor: Colors.gold.primary,
  },
  productItemImage: {
    width: '100%',
    height: '100%',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cameraGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  mainCameraButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.gold.primary,
  },
});