import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const COLORS = {
  black: '#0A0A0A',
  red: '#FF1744',
  silver: '#C0C0C0',
  cardBg: '#1A1A1A',
  textSecondary: '#888',
};

const formatPrice = (price) =>
  'Rp ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export default function CarDetailScreen({ route, navigation }) {
  const { car } = route.params;

  const { toggleFavorite, isFavorite } = useAuth();
  const saved = isFavorite(car.id);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: car.image }}
            style={styles.heroImage}
          />

          <LinearGradient
            colors={[
              'rgba(0,0,0,0.5)',
              'transparent',
              '#0A0A0A',
            ]}
            style={StyleSheet.absoluteFill}
          />

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#fff"
            />
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => toggleFavorite(car)}
          >
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={22}
              color={saved ? COLORS.red : '#fff'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Brand & Name */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.brand}>
                {car.brand}
              </Text>

              <Text style={styles.carName}>
                {car.name}
              </Text>
            </View>

            <View>
              <View style={styles.ratingRow}>
                <Ionicons
                  name="star"
                  size={14}
                  color="#FFD700"
                />

                <Text style={styles.ratingText}>
                  {car.rating}
                </Text>
              </View>

              <Text style={styles.reviewCount}>
                ({car.reviews} ulasan)
              </Text>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tagRow}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>
                {car.category}
              </Text>
            </View>

            {car.tag && (
              <View style={styles.specialTag}>
                <Text style={styles.specialTagText}>
                  {car.tag}
                </Text>
              </View>
            )}

            <View
              style={[
                styles.availTag,
                !car.available && styles.availTagNo,
              ]}
            >
              <View
                style={[
                  styles.availDot,
                  !car.available && {
                    backgroundColor: '#F44336',
                  },
                ]}
              />

              <Text style={styles.availText}>
                {car.available
                  ? 'Tersedia'
                  : 'Tidak Tersedia'}
              </Text>
            </View>
          </View>

          {/* Specs */}
          <View style={styles.specsGrid}>
            {[
              {
                icon: 'flash',
                label: 'Tenaga',
                value: car.power,
                color: COLORS.red,
              },
              {
                icon: 'speedometer',
                label: 'Top Speed',
                value: car.speed,
                color: '#00BCD4',
              },
              {
                icon: 'people',
                label: 'Kapasitas',
                value: `${car.seats} Orang`,
                color: '#7C4DFF',
              },
              {
                icon: 'settings',
                label: 'Transmisi',
                value: car.transmission,
                color: '#FF9800',
              },
            ].map((spec, i) => (
              <View key={i} style={styles.specCard}>
                <View
                  style={[
                    styles.specIconBox,
                    {
                      backgroundColor:
                        spec.color + '20',
                    },
                  ]}
                >
                  <Ionicons
                    name={spec.icon}
                    size={20}
                    color={spec.color}
                  />
                </View>

                <Text style={styles.specValue}>
                  {spec.value}
                </Text>

                <Text style={styles.specLabel}>
                  {spec.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Deskripsi
            </Text>

            <Text style={styles.description}>
              {car.description}
            </Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Fitur Unggulan
            </Text>

            <View style={styles.featuresGrid}>
              {car.features.map((feat, i) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={COLORS.red}
                  />

                  <Text style={styles.featureText}>
                    {feat}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Terms */}
          <View style={styles.termsBox}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={COLORS.silver}
            />

            <Text style={styles.termsText}>
              Minimal sewa 1 hari · Deposit 50% ·
              SIM A wajib · Bahan bakar tidak
              termasuk
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.bottomLabel}>
            Per Hari
          </Text>

          <Text style={styles.bottomPrice}>
            {formatPrice(car.price)}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.bookBtn,
            !car.available &&
              styles.bookBtnDisabled,
          ]}
          disabled={!car.available}
          onPress={() =>
            navigation.navigate('Booking', {
              car,
            })
          }
        >
          <LinearGradient
            colors={
              car.available
                ? ['#FF1744', '#CC0000']
                : ['#333', '#222']
            }
            style={styles.bookBtnGradient}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#fff"
            />

            <Text style={styles.bookBtnText}>
              {car.available
                ? 'Pesan Sekarang'
                : 'Tidak Tersedia'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  heroContainer: {
    height: 300,
    position: 'relative',
  },

  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  backBtn: {
    position: 'absolute',
    top: 56,
    left: 20,
    width: 42,
    height: 42,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveBtn: {
    position: 'absolute',
    top: 56,
    right: 20,
    width: 42,
    height: 42,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  brand: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },

  carName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'flex-end',
  },

  ratingText: {
    color: '#FFD700',
    fontWeight: '800',
    fontSize: 16,
  },

  reviewCount: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textAlign: 'right',
    marginTop: 2,
  },

  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },

  categoryTag: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  categoryTagText: {
    color: COLORS.silver,
    fontSize: 12,
    fontWeight: '600',
  },

  specialTag: {
    backgroundColor: 'rgba(255,23,68,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,23,68,0.3)',
  },

  specialTagText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: '700',
  },

  availTag: {
    backgroundColor: 'rgba(76,175,80,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  availTagNo: {
    backgroundColor: 'rgba(244,67,54,0.15)',
  },

  availDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },

  availText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },

  specsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  specCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },

  specIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  specValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 2,
  },

  specLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    textAlign: 'center',
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },

  description: {
    color: '#999',
    lineHeight: 22,
    fontSize: 14,
  },

  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },

  featureText: {
    color: COLORS.silver,
    fontSize: 12,
    fontWeight: '500',
  },

  termsBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 100,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },

  termsText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#141414',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },

  priceContainer: {
    flex: 1,
  },

  bottomLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginBottom: 2,
  },

  bottomPrice: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },

  bookBtn: {
    flex: 2,
    borderRadius: 14,
    overflow: 'hidden',
  },

  bookBtnDisabled: {
    opacity: 0.5,
  },

  bookBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },

  bookBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});