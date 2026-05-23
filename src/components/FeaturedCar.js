import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = 220;

const formatPrice = (price) =>
  'Rp ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export default function FeaturedCar({ cars, onPress }) {
  const scrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const featuredCars = cars.filter((c) => c.available).slice(0, 5);

  const handleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.wrapper}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
      >
        {featuredCars.map((car, index) => {
          // Parallax scale effect
          const inputRange = [
            (index - 1) * (CARD_WIDTH + 16),
            index * (CARD_WIDTH + 16),
            (index + 1) * (CARD_WIDTH + 16),
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.93, 1, 0.93],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={car.id}
              style={[styles.cardWrapper, { transform: [{ scale }], opacity }]}
            >
              <TouchableOpacity
                activeOpacity={0.92}
                onPress={() => onPress(car)}
                style={styles.card}
              >
                {/* Background Image */}
                <Image source={{ uri: car.image }} style={styles.cardImage} />

                {/* Gradient overlay */}
                <LinearGradient
                  colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.88)']}
                  style={StyleSheet.absoluteFill}
                />

                {/* Top badges */}
                <View style={styles.topRow}>
                  <View style={styles.tagBadge}>
                    <View style={styles.tagDot} />
                    <Text style={styles.tagText}>{car.tag || 'FEATURED'}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={11} color="#FFD700" />
                    <Text style={styles.ratingText}>{car.rating}</Text>
                  </View>
                </View>

                {/* Bottom content */}
                <View style={styles.bottomContent}>
                  {/* Spec pills */}
                  <View style={styles.specRow}>
                    {[
                      { icon: 'flash', label: car.power },
                      { icon: 'speedometer', label: car.speed },
                      { icon: 'people', label: `${car.seats} Seats` },
                    ].map((s, i) => (
                      <View key={i} style={styles.specPill}>
                        <Ionicons name={s.icon} size={10} color="#FF1744" />
                        <Text style={styles.specPillText}>{s.label}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.infoRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.carBrand}>{car.brand}</Text>
                      <Text style={styles.carName} numberOfLines={1}>
                        {car.name}
                      </Text>
                    </View>
                    <View style={styles.priceBlock}>
                      <Text style={styles.priceLabel}>Per hari</Text>
                      <Text style={styles.price}>{formatPrice(car.price)}</Text>
                    </View>
                  </View>

                  {/* CTA strip */}
                  <TouchableOpacity onPress={() => onPress(car)} style={styles.ctaStrip}>
                    <Text style={styles.ctaText}>Lihat Detail & Sewa</Text>
                    <View style={styles.ctaArrow}>
                      <Ionicons name="arrow-forward" size={14} color="#fff" />
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      {/* Dot Indicators */}
      <View style={styles.dots}>
        {featuredCars.map((_, i) => {
          const dotWidth = scrollX.interpolate({
            inputRange: [
              (i - 1) * (CARD_WIDTH + 16),
              i * (CARD_WIDTH + 16),
              (i + 1) * (CARD_WIDTH + 16),
            ],
            outputRange: [6, 22, 6],
            extrapolate: 'clamp',
          });
          const dotColor = scrollX.interpolate({
            inputRange: [
              (i - 1) * (CARD_WIDTH + 16),
              i * (CARD_WIDTH + 16),
              (i + 1) * (CARD_WIDTH + 16),
            ],
            outputRange: ['#333', '#FF1744', '#333'],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, backgroundColor: dotColor }]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 4 },
  scrollContent: { paddingHorizontal: 24, paddingRight: 24 },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 16,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  card: { flex: 1 },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    paddingBottom: 0,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,23,68,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  tagDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#fff',
  },
  tagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '800',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  specRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  specPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,23,68,0.3)',
  },
  specPillText: {
    color: '#ddd',
    fontSize: 10,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  carBrand: {
    color: '#FF1744',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  carName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  priceBlock: { alignItems: 'flex-end' },
  priceLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9,
    marginBottom: 2,
  },
  price: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  ctaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,23,68,0.18)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,23,68,0.35)',
  },
  ctaText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  ctaArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF1744',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    marginBottom: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});