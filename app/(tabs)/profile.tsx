import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Settings, Heart, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import Colors from '@/constants/Colors';
import { products } from '@/data/products';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

const DEFAULT_AVATAR =
  'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg';
const DEFAULT_PREFERENCES = ['Vestidos', 'Calzado', 'Accesorios'];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, authLoading } = useAuthContext();
  const [wishlistItems] = useState(products.filter(p => p.inWishlist));

  const handleEditProfile = () => {
    // Edit profile functionality (would implement in a full app)
    console.log('Edit profile pressed');
  };
  
  const handleSettings = () => {
    // Settings functionality (would implement in a full app)
    console.log('Settings pressed');
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.warn('No se pudo cerrar sesión', error);
    }
  };

  const memberSinceLabel = useMemo(() => {
    if (!user?.createdAt) {
      return 'Miembro';
    }

    try {
      const date = new Date(user.createdAt);
      return `Miembro desde ${date.toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
      })}`;
    } catch (error) {
      console.warn('Error al formatear la fecha de registro', error);
      return 'Miembro';
    }
  }, [user?.createdAt]);

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
              <Image source={{ uri: DEFAULT_AVATAR }} style={styles.avatar} />
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
              {user?.name ?? 'Invitado'}
            </Typography>
            <Typography variant="body2" color={Colors.dark.secondaryText}>
              {user?.email ?? 'Sin correo registrado'}
            </Typography>
            <Typography
              variant="caption"
              color={Colors.gold.primary}
              style={styles.memberSince}
            >
              {memberSinceLabel}
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
            {DEFAULT_PREFERENCES.map((preference, index) => (
              <View key={index} style={styles.preferenceTag}>
                <Typography variant="caption" color={Colors.dark.background}>
                  {preference}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={authLoading}
        >
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