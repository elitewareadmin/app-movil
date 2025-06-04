import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import Typography from '@/components/ui/Typography';
import ProductCard from '@/components/product/ProductCard';
import Colors from '@/constants/Colors';
import { products } from '@/data/products';
import { Product } from '@/types/product';

export default function CatalogScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(text.toLowerCase()) ||
          product.brand.toLowerCase().includes(text.toLowerCase()) ||
          product.category.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredProducts(products);
  };
  
  const handleProductPress = (product: Product) => {
    // Navigate to product detail (would implement in a full app)
    console.log('Product pressed:', product.name);
  };
  
  const handleAddToWishlist = (product: Product) => {
    // Add to wishlist functionality (would implement in a full app)
    console.log('Add to wishlist:', product.name);
  };
  
  const handleFilter = () => {
    // Filter functionality (would implement in a full app)
    console.log('Filter pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" style={styles.title}>
          Catalog
        </Typography>
        <Typography variant="body2" color={Colors.dark.secondaryText}>
          Explore our luxury collection
        </Typography>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.dark.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands..."
            placeholderTextColor={Colors.dark.secondaryText}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={Colors.dark.secondaryText} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <SlidersHorizontal size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>
      
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handleProductPress}
              onAddToWishlist={handleAddToWishlist}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={Platform.OS === 'web' && Platform.windowWidth > 768 ? 3 : 2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsGrid}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Typography variant="h3" style={styles.noResultsText}>
            No products found
          </Typography>
          <Typography variant="body1" color={Colors.dark.secondaryText}>
            Try adjusting your search or filters
          </Typography>
        </View>
      )}
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.dark.divider,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    marginLeft: 12,
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.divider,
  },
  productsGrid: {
    paddingHorizontal: 8,
    paddingBottom: 16,
    ...Platform.select({
      web: {
        maxWidth: 1200,
        alignSelf: 'center',
      },
    }),
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noResultsText: {
    marginBottom: 8,
  },
});