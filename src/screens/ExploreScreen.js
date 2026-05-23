import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cars } from '../data/cars';
import CarCard from '../components/CarCard';
import CategoryFilter from '../components/CategoryFilter';

export default function ExploreScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const filtered = cars
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.brand.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'All' || c.category === activeCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return b.rating - a.rating;
    });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jelajahi Armada</Text>
        <Text style={styles.headerSub}>{filtered.length} kendaraan tersedia</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari mobil impianmu..."
            placeholderTextColor="#555"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sort */}
      <View style={styles.sortRow}>
        {[
          { key: 'popular', label: 'Populer' },
          { key: 'price_asc', label: 'Termurah' },
          { key: 'price_desc', label: 'Termahal' },
        ].map((s) => (
          <TouchableOpacity
            key={s.key}
            style={[styles.sortBtn, sortBy === s.key && styles.sortBtnActive]}
            onPress={() => setSortBy(s.key)}
          >
            <Text style={[styles.sortText, sortBy === s.key && styles.sortTextActive]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <CategoryFilter active={activeCategory} onSelect={setActiveCategory} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CarCard
            car={item}
            onPress={() => navigation.navigate('CarDetail', { car: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="car-outline" size={48} color="#333" />
            <Text style={styles.emptyText}>Tidak ada kendaraan ditemukan</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '900' },
  headerSub: { color: '#666', fontSize: 13, marginTop: 2 },
  searchContainer: { paddingHorizontal: 20, marginBottom: 14 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 14, paddingHorizontal: 14, gap: 10, borderWidth: 1, borderColor: '#2A2A2A' },
  searchInput: { flex: 1, color: '#fff', fontSize: 14, paddingVertical: 14 },
  sortRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 14 },
  sortBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#2A2A2A' },
  sortBtnActive: { backgroundColor: '#FF1744', borderColor: '#FF1744' },
  sortText: { color: '#666', fontSize: 12, fontWeight: '600' },
  sortTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, gap: 14, paddingBottom: 100 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { color: '#444', marginTop: 12, fontSize: 14 },
});