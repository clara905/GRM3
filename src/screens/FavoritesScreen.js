import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const C = { black: '#0A0A0A', red: '#FF1744', silver: '#C0C0C0', card: '#1A1A1A', muted: '#666' };
const formatPrice = p => 'Rp ' + p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export default function FavoritesScreen({ navigation }) {
  const { favorites, toggleFavorite } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Favorit Saya</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{favorites.length}</Text>
        </View>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={48} color="#2A2A2A" />
          </View>
          <Text style={styles.emptyTitle}>Belum Ada Favorit</Text>
          <Text style={styles.emptyDesc}>Tambahkan kendaraan impianmu ke daftar favorit</Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate('Explore')}>
            <LinearGradient colors={['#FF1744', '#CC0000']} style={styles.exploreBtnGradient}>
              <Text style={styles.exploreBtnText}>Jelajahi Armada</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.favCard}>
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => navigation.navigate('CarDetail', { car: item })}
              >
                <Image source={{ uri: item.image }} style={styles.carImage} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={StyleSheet.absoluteFill} />
                {item.tag && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.tag}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.cardBody}>
                <View style={styles.topRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.brand}>{item.brand}</Text>
                    <Text style={styles.name}>{item.name}</Text>
                  </View>
                  <TouchableOpacity style={styles.heartBtn} onPress={() => toggleFavorite(item)}>
                    <Ionicons name="heart" size={20} color={C.red} />
                  </TouchableOpacity>
                </View>

                <View style={styles.specsRow}>
                  {[
                    { icon: 'flash-outline', val: item.power },
                    { icon: 'speedometer-outline', val: item.speed },
                    { icon: 'people-outline', val: `${item.seats} Org` },
                  ].map((s, i) => (
                    <View key={i} style={styles.spec}>
                      <Ionicons name={s.icon} size={12} color={C.red} />
                      <Text style={styles.specText}>{s.val}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.bottomRow}>
                  <View>
                    <Text style={styles.priceLabel}>Per hari</Text>
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.bookBtn, !item.available && styles.bookBtnDisabled]}
                    disabled={!item.available}
                    onPress={() => navigation.navigate('CarDetail', { car: item })}
                  >
                    <Text style={styles.bookText}>{item.available ? 'Sewa' : 'Penuh'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.black },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  backBtn: { width: 42, height: 42, backgroundColor: '#1A1A1A', borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  countBadge: { width: 42, height: 42, backgroundColor: 'rgba(255,23,68,0.15)', borderRadius: 21, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,23,68,0.3)' },
  countText: { color: C.red, fontWeight: '900', fontSize: 16 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { width: 100, height: 100, backgroundColor: '#111', borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  emptyDesc: { color: C.muted, fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  exploreBtn: { borderRadius: 14, overflow: 'hidden' },
  exploreBtnGradient: { paddingHorizontal: 28, paddingVertical: 14 },
  exploreBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  list: { paddingHorizontal: 20, gap: 14, paddingBottom: 100 },
  favCard: { backgroundColor: '#1A1A1A', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#2A2A2A' },
  imageContainer: { height: 160, position: 'relative' },
  carImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  tag: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(255,23,68,0.9)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  cardBody: { padding: 16 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  brand: { color: C.red, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  name: { color: '#fff', fontSize: 16, fontWeight: '800' },
  heartBtn: { width: 36, height: 36, backgroundColor: 'rgba(255,23,68,0.1)', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  specsRow: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  spec: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  specText: { color: C.muted, fontSize: 11 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { color: C.muted, fontSize: 10, marginBottom: 2 },
  price: { color: '#fff', fontSize: 15, fontWeight: '900' },
  bookBtn: { backgroundColor: C.red, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  bookBtnDisabled: { backgroundColor: '#333' },
  bookText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});