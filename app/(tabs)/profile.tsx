import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { Settings, ShoppingBag, Heart, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import Colors from '@/constants/Colors';
import { products } from '@/data/products';

// Mock user data
const user = {
  name: 'Sophia Martinez',
  email: 'sophia@example.com',
  avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
  memberSince: 'January 2023',
  preferences: ['Dresses', 'Shoes', 'Accessories'],
};

export default function ProfileScreen() {
  const [wishlistItems] = useState(products.filter(p => p.inWishlist));
  
  const handleEditProfile = () => {
    // Edit profile functionality (would implement in a full app)
    console.log('Edit profile pressed');
  };
  
  const handleSettings = () => {
    // Settings functionality (would implement in a full app)
    console.log('Settings pressed');
  };
  
  const handleLogout = () => {
    // Logout functionality (would implement in a full app)
    console.log('Logout pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LinearGradient
            colors={['rgba(212, 175, 55, 0.2)', 'rgba(183, 110, 121, 0.2)']}
            style={styles.headerGradient}
          />
          
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
              />
              <TouchableOpacity 
                style={styles.editAvatarButton}
                onPress={handleEditProfile}
              >
                <LinearGradient
                  colors={[Colors.gold.primary, Colors.roseGold.primary]}
                  style={styles.editAvatarGradient}
                />
                <Settings size={16} color={Colors.dark.background} />
              </TouchableOpacity>
            </View>
            
            <Typography variant="h2" style={styles.userName}>
              {user.name}
            </Typography>
            <Typography variant="body2" color={Colors.dark.secondaryText}>
              {user.email}
            </Typography>
            <Typography variant="caption" color={Colors.gold.primary} style={styles.memberSince}>
              Member since {user.memberSince}
            </Typography>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Edit Profile"
            variant="outlined"
            onPress={handleEditProfile}
            style={styles.actionButton}
          />
          <Button
            title="Settings"
            variant="outlined"
            icon={<Settings size={16} color={Colors.gold.primary} />}
            onPress={handleSettings}
            style={styles.actionButton}
          />
        </View>
        
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            My Wishlist
          </Typography>
          
          {wishlistItems.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.wishlistContainer}
            >
              {wishlistItems.map((item) => (
                <GlassmorphicCard key={item.id} style={styles.wishlistItem}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.wishlistItemImage}
                    resizeMode="cover"
                  />
                  <View style={styles.wishlistItemInfo}>
                    <Typography variant="subtitle2" numberOfLines={1}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color={Colors.gold.primary}>
                      ${item.price.toFixed(2)}
                    </Typography>
                  </View>
                  <TouchableOpacity style={styles.removeWishlistButton}>
                    <Heart size={16} color={Colors.roseGold.primary} fill={Colors.roseGold.primary} />
                  </TouchableOpacity>
                </GlassmorphicCard>
              ))}
            </ScrollView>
          ) : (
            <Typography variant="body2" color={Colors.dark.secondaryText} style={styles.emptyStateText}>
              Your wishlist is empty
            </Typography>
          )}
        </View>
        
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Style Preferences
          </Typography>
          
          <View style={styles.preferencesContainer}>
            {user.preferences.map((preference, index) => (
              <View key={index} style={styles.preferenceTag}>
                <Typography variant="caption" color={Colors.dark.background}>
                  {preference}
                </Typography>
              </View>
            ))}
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.dark.secondaryText} style={styles.logoutIcon} />
          <Typography variant="button" color={Colors.dark.secondaryText}>
            Log Out
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    padding: 24,
    position: 'relative',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    opacity: 0.5,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.gold.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gold.primary,
    overflow: 'hidden',
  },
  editAvatarGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  userName: {
    marginBottom: 4,
  },
  memberSince: {
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 8,
  },
  actionButton: {
    marginHorizontal: 8,
    minWidth: 120,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  wishlistContainer: {
    paddingRight: 16,
  },
  wishlistItem: {
    width: 150,
    marginRight: 12,
    overflow: 'hidden',
  },
  wishlistItemImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  wishlistItemInfo: {
    padding: 12,
  },
  removeWishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preferenceTag: {
    backgroundColor: Colors.gold.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 24,
  },
  logoutIcon: {
    marginRight: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    padding: 16,
  },
});