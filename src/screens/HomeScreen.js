import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { cars } from '../data/cars';
import CarCard from '../components/CarCard';
import CategoryFilter from '../components/CategoryFilter';
import FeaturedCar from '../components/FeaturedCar';

const { width } = Dimensions.get('window');

const COLORS = {
  black: '#0A0A0A',
  red: '#FF1744',
  silver: '#C0C0C0',
  darkGray: '#141414',
  cardBg: '#1A1A1A',
  text: '#FFFFFF',
  textSecondary: '#888888',
};

export default function HomeScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const scrollY = useRef(new Animated.Value(0)).current;

  const filteredCars =
    activeCategory === 'All'
      ? cars
      : cars.filter((c) => c.category === activeCategory);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Animated Header */}
      <Animated.View
        style={[styles.header, { opacity: headerOpacity }]}
      >
        <LinearGradient
          colors={['#0A0A0A', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.logoText}>
              GRAND <Text style={styles.logoAccent}>WHEELS</Text>
            </Text>

            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={COLORS.silver}
              />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>
                Selamat datang,
              </Text>

              <Text style={styles.userName}>
                Arya Dwiputra 👋
              </Text>
            </View>

            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#fff"
              />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          <Text style={styles.heroLabel}>
            Armada Unggulan
          </Text>

          <FeaturedCar
            cars={cars}
            onPress={(car) =>
              navigation.navigate('CarDetail', { car })
            }
          />
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          {[
            { value: '50+', label: 'Armada' },
            { value: '2K+', label: 'Pelanggan' },
            { value: '4.9', label: 'Rating' },
            { value: '24/7', label: 'Support' },
          ].map((stat, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>
                {stat.value}
              </Text>

              <Text style={styles.statLabel}>
                {stat.label}
              </Text>

              {i < 3 && (
                <View style={styles.statDivider} />
              )}
            </View>
          ))}
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Layanan Kami
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.servicesScroll}
          >
            {[
              {
                icon: 'car-sport',
                label: 'Self Drive',
                color: '#FF1744',
              },
              {
                icon: 'person',
                label: 'With Driver',
                color: '#7C4DFF',
              },
              {
                icon: 'airplane',
                label: 'Airport',
                color: '#00BCD4',
              },
              {
                icon: 'gift',
                label: 'Wedding',
                color: '#FF9800',
              },
              {
                icon: 'trophy',
                label: 'VIP Event',
                color: '#4CAF50',
              },
            ].map((service, i) => (
              <TouchableOpacity
                key={i}
                style={styles.serviceCard}
              >
                <View
                  style={[
                    styles.serviceIcon,
                    {
                      backgroundColor:
                        service.color + '20',
                      borderColor:
                        service.color + '40',
                    },
                  ]}
                >
                  <Ionicons
                    name={service.icon}
                    size={24}
                    color={service.color}
                  />
                </View>

                <Text style={styles.serviceLabel}>
                  {service.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Fleet */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Armada Premium
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Explore')
              }
            >
              <Text style={styles.seeAll}>
                Lihat Semua
              </Text>
            </TouchableOpacity>
          </View>

          <CategoryFilter
            active={activeCategory}
            onSelect={setActiveCategory}
          />

          <View style={styles.carGrid}>
            {filteredCars
              .slice(0, 4)
              .map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onPress={() =>
                    navigation.navigate(
                      'CarDetail',
                      { car }
                    )
                  }
                />
              ))}
          </View>
        </View>

        {/* Promo */}
        <TouchableOpacity style={styles.promoBanner}>
          <LinearGradient
            colors={['#FF1744', '#880E4F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promoGradient}
          >
            <View style={styles.promoContent}>
              <View>
                <Text style={styles.promoTag}>
                  PROMO EKSKLUSIF
                </Text>

                <Text style={styles.promoTitle}>
                  Diskon 20%
                </Text>

                <Text style={styles.promoSub}>
                  Weekend booking · Min 2 hari
                </Text>
              </View>

              <View style={styles.promoRight}>
                <Text style={styles.promoEmoji}>
                  🏎️
                </Text>

                <Text style={styles.promoCode}>
                  VROOM20
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },

  headerGradient: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 3,
  },

  logoAccent: {
    color: COLORS.red,
  },

  heroSection: {
    paddingTop: 56,
    paddingBottom: 8,
    backgroundColor: '#0A0A0A',
  },

  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },

  greeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
  },

  userName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },

  heroLabel: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    paddingHorizontal: 24,
    marginBottom: 12,
  },

  notifBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notifDot: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.red,
    borderRadius: 4,
    position: 'absolute',
    top: 6,
    right: 6,
  },

  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },

  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },

  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },

  statDivider: {
    position: 'absolute',
    right: 0,
    top: 6,
    width: 1,
    height: 30,
    backgroundColor: '#2A2A2A',
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 28,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },

  seeAll: {
    color: COLORS.red,
    fontSize: 13,
    fontWeight: '600',
  },

  servicesScroll: {
    marginTop: 16,
  },

  serviceCard: {
    alignItems: 'center',
    marginRight: 20,
  },

  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 8,
  },

  serviceLabel: {
    color: COLORS.silver,
    fontSize: 11,
    fontWeight: '600',
  },

  carGrid: {
    gap: 14,
    marginTop: 4,
  },

  promoBanner: {
    marginHorizontal: 20,
    marginTop: 28,
    borderRadius: 20,
    overflow: 'hidden',
  },

  promoGradient: {
    padding: 24,
  },

  promoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  promoTag: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },

  promoTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 36,
  },

  promoSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },

  promoRight: {
    alignItems: 'center',
  },

  promoEmoji: {
    fontSize: 40,
  },

  promoCode: {
    color: '#fff',
    fontWeight: '800',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    fontSize: 12,
    letterSpacing: 1,
  },
});