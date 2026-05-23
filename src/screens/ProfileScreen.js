import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout, rentals, favorites } = useAuth();

  const activeRentals =
    rentals?.filter((r) => r.status === 'active') || [];

  const menuItems = [
    {
      icon: 'car-outline',
      label: 'Riwayat Sewa',
      badge: rentals?.length > 0 ? String(rentals.length) : null,
      onPress: () => navigation.navigate('RentalHistory'),
    },
    {
      icon: 'heart-outline',
      label: 'Favorit Saya',
      badge: favorites?.length > 0 ? String(favorites.length) : null,
      onPress: () => navigation.navigate('Favorites'),
    },
    {
      icon: 'card-outline',
      label: 'Metode Pembayaran',
      onPress: () =>
        Alert.alert(
          'Segera Hadir',
          'Fitur ini sedang dikembangkan'
        ),
    },
    {
      icon: 'document-text-outline',
      label: 'Syarat & Ketentuan',
      onPress: () => navigation.navigate('Terms'),
    },
    {
      icon: 'help-circle-outline',
      label: 'Bantuan & FAQ',
      onPress: () =>
        Alert.alert(
          'Bantuan',
          'Hubungi kami di wa.me/6281234567890'
        ),
    },
    {
      icon: 'log-out-outline',
      label: 'Keluar',
      danger: true,
      onPress: () =>
        Alert.alert('Keluar', 'Yakin ingin keluar?', [
          {
            text: 'Batal',
            style: 'cancel',
          },
          {
            text: 'Keluar',
            style: 'destructive',
            onPress: logout,
          },
        ]),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1A0000', '#0A0A0A']}
          style={styles.profileHeader}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'GW'}
              </Text>
            </View>

            <View style={styles.premiumBadge}>
              <Ionicons
                name="diamond"
                size={10}
                color="#FFD700"
              />
              <Text style={styles.premiumText}>PREMIUM</Text>
            </View>
          </View>

          <Text style={styles.profileName}>
            {user?.name || 'Grand Wheels User'}
          </Text>

          <Text style={styles.profileEmail}>
            {user?.email || 'user@email.com'}
          </Text>

          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatVal}>
                {rentals?.length || 0}
              </Text>
              <Text style={styles.profileStatLabel}>
                Total Sewa
              </Text>
            </View>

            <View style={styles.profileStat}>
              <Text style={styles.profileStatVal}>4.9</Text>
              <Text style={styles.profileStatLabel}>Rating</Text>
            </View>

            <View style={styles.profileStat}>
              <Text style={styles.profileStatVal}>Gold</Text>
              <Text style={styles.profileStatLabel}>Member</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.activeSectionWrapper}>
          <View style={styles.activeSectionHeader}>
            <Text style={styles.activeSectionTitle}>
              Sewa Aktif
            </Text>
          </View>

          {activeRentals.length > 0 ? (
            activeRentals.map((rental, i) => (
              <View
                key={rental.id || i}
                style={styles.activeRentalCard}
              >
                <Text style={styles.activeCar}>
                  {rental.carName}
                </Text>

                <Text style={styles.activeBrand}>
                  {rental.carBrand}
                </Text>

                <Text style={styles.activeInfo}>
                  {rental.startDate} - {rental.endDate}
                </Text>

                <Text style={styles.activeInfo}>
                  {rental.days} hari
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.noActiveRental}>
              <Text style={styles.noActiveTitle}>
                Tidak ada sewa aktif
              </Text>
            </View>
          )}
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={item.danger ? '#FF1744' : '#C0C0C0'}
              />

              <Text
                style={[
                  styles.menuLabel,
                  item.danger && styles.menuLabelDanger,
                ]}
              >
                {item.label}
              </Text>

              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  profileHeader: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 30,
  },

  avatarContainer: {
    marginBottom: 16,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FF1744',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
  },

  premiumBadge: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    backgroundColor: '#222',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  premiumText: {
    color: '#FFD700',
    fontSize: 9,
    fontWeight: '800',
  },

  profileName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },

  profileEmail: {
    color: '#666',
    marginTop: 4,
  },

  profileStats: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 24,
  },

  profileStat: {
    alignItems: 'center',
  },

  profileStatVal: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },

  profileStatLabel: {
    color: '#666',
    fontSize: 11,
  },

  activeSectionWrapper: {
    marginHorizontal: 20,
    marginTop: 20,
  },

  activeSectionHeader: {
    marginBottom: 10,
  },

  activeSectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  activeRentalCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },

  activeCar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  activeBrand: {
    color: '#999',
    marginTop: 2,
  },

  activeInfo: {
    color: '#777',
    marginTop: 6,
    fontSize: 12,
  },

  noActiveRental: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },

  noActiveTitle: {
    color: '#666',
  },

  menuSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 8,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },

  menuLabel: {
    color: '#ddd',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },

  menuLabelDanger: {
    color: '#FF1744',
  },

  badge: {
    backgroundColor: '#FF1744',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
});