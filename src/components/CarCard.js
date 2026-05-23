import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  red: '#FF1744',
  silver: '#C0C0C0',
  cardBg: '#1A1A1A',
  textSecondary: '#888888',
};

const formatPrice = (price) =>
  'Rp ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export default function CarCard({ car, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: car.image }} style={styles.image} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.imgGradient} />
        {car.tag && (
          <View style={[styles.tag, !car.available && styles.tagUnavailable]}>
            <Text style={styles.tagText}>{car.available ? car.tag : 'BOOKED'}</Text>
          </View>
        )}
        {!car.available && <View style={styles.overlay}><Text style={styles.overlayText}>TIDAK TERSEDIA</Text></View>}
      </View>
      <View style={styles.info}>
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.brand}>{car.brand}</Text>
            <Text style={styles.name} numberOfLines={1}>{car.name}</Text>
          </View>
          <View style={styles.ratingBox}>
            <Ionicons name="star" size={11} color="#FFD700" />
            <Text style={styles.rating}>{car.rating}</Text>
          </View>
        </View>
        <View style={styles.specsRow}>
          <View style={styles.spec}>
            <Ionicons name="flash-outline" size={12} color={COLORS.red} />
            <Text style={styles.specText}>{car.power}</Text>
          </View>
          <View style={styles.spec}>
            <Ionicons name="speedometer-outline" size={12} color={COLORS.red} />
            <Text style={styles.specText}>{car.speed}</Text>
          </View>
          <View style={styles.spec}>
            <Ionicons name="people-outline" size={12} color={COLORS.red} />
            <Text style={styles.specText}>{car.seats} Seats</Text>
          </View>
        </View>
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.priceLabel}>Per hari</Text>
            <Text style={styles.price}>{formatPrice(car.price)}</Text>
          </View>
          <TouchableOpacity style={[styles.rentBtn, !car.available && styles.rentBtnDisabled]} disabled={!car.available} onPress={onPress}>
            <Text style={styles.rentText}>{car.available ? 'Sewa' : 'Penuh'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  imageContainer: { height: 180, position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  imgGradient: { ...StyleSheet.absoluteFillObject },
  tag: {
    position: 'absolute', top: 12, left: 12,
    backgroundColor: 'rgba(255,23,68,0.9)', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  tagUnavailable: { backgroundColor: 'rgba(0,0,0,0.7)' },
  tagText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  overlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  overlayText: { color: '#fff', fontWeight: '800', letterSpacing: 2 },
  info: { padding: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  brand: { color: COLORS.red, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  name: { color: '#fff', fontSize: 16, fontWeight: '800' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(255,215,0,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  rating: { color: '#FFD700', fontSize: 12, fontWeight: '700' },
  specsRow: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  spec: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  specText: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '500' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { color: COLORS.textSecondary, fontSize: 10, marginBottom: 2 },
  price: { color: '#fff', fontSize: 15, fontWeight: '900' },
  rentBtn: { backgroundColor: COLORS.red, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  rentBtnDisabled: { backgroundColor: '#333' },
  rentText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});