import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const C = {
  black: '#0A0A0A',
  red: '#FF1744',
  silver: '#C0C0C0',
  card: '#1A1A1A',
  muted: '#666',
};

const formatPrice = (p) =>
  'Rp ' + p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const STATUS_CONFIG = {
  active: {
    label: 'Sedang Berjalan',
    color: '#4CAF50',
    bg: 'rgba(76,175,80,0.15)',
    icon: 'car-sport',
  },

  completed: {
    label: 'Selesai',
    color: '#888',
    bg: 'rgba(136,136,136,0.15)',
    icon: 'checkmark-circle',
  },

  cancelled: {
    label: 'Dibatalkan',
    color: C.red,
    bg: 'rgba(255,23,68,0.15)',
    icon: 'close-circle',
  },
};

export default function RentalHistoryScreen({ navigation }) {
  const { rentals } = useAuth();

  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all'
      ? rentals
      : rentals.filter((r) => r.status === filter);

  const renderStars = (rating) => (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={12}
          color="#FFD700"
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Riwayat Sewa</Text>

        <View style={{ width: 42 }} />
      </View>

      {/* SUMMARY */}
      <View style={styles.summaryRow}>
        {[
          {
            label: 'Total Sewa',
            value: rentals.length,
            color: C.red,
          },

          {
            label: 'Selesai',
            value: rentals.filter(
              (r) => r.status === 'completed'
            ).length,
            color: '#888',
          },

          {
            label: 'Aktif',
            value: rentals.filter(
              (r) => r.status === 'active'
            ).length,
            color: '#4CAF50',
          },
        ].map((s, i) => (
          <View
            key={i}
            style={[
              styles.summaryCard,
              { borderColor: s.color + '40' },
            ]}
          >
            <Text
              style={[
                styles.summaryVal,
                { color: s.color },
              ]}
            >
              {s.value}
            </Text>

            <Text style={styles.summaryLabel}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      {/* FILTER */}
      <View style={styles.filterRow}>
        {[
          { key: 'all', label: 'Semua' },
          { key: 'active', label: 'Aktif' },
          { key: 'completed', label: 'Selesai' },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterBtn,
              filter === f.key &&
                styles.filterBtnActive,
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f.key &&
                  styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="car-outline"
              size={48}
              color="#2A2A2A"
            />

            <Text style={styles.emptyText}>
              Belum ada riwayat sewa
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const statusCfg = STATUS_CONFIG[item.status];

          return (
            <View style={styles.rentalCard}>
              {/* IMAGE */}
              <View style={styles.cardImageContainer}>
                <Image
                  source={{ uri: item.carImage }}
                  style={styles.cardImage}
                />

                <LinearGradient
                  colors={[
                    'transparent',
                    'rgba(0,0,0,0.7)',
                  ]}
                  style={StyleSheet.absoluteFill}
                />

                {/* STATUS */}
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: statusCfg.bg,
                      borderColor:
                        statusCfg.color + '40',
                    },
                  ]}
                >
                  <Ionicons
                    name={statusCfg.icon}
                    size={11}
                    color={statusCfg.color}
                  />

                  <Text
                    style={[
                      styles.statusText,
                      { color: statusCfg.color },
                    ]}
                  >
                    {statusCfg.label}
                  </Text>
                </View>

                {/* BOOKING ID */}
                <Text style={styles.cardBookingId}>
                  {item.id}
                </Text>
              </View>

              {/* BODY */}
              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <View>
                    <Text style={styles.cardBrand}>
                      {item.carBrand}
                    </Text>

                    <Text style={styles.cardName}>
                      {item.carName}
                    </Text>
                  </View>

                  <Text style={styles.cardTotal}>
                    {formatPrice(item.total)}
                  </Text>
                </View>

                {/* DATE */}
                <View style={styles.cardDateRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={13}
                    color={C.muted}
                  />

                  <Text style={styles.cardDate}>
                    {item.startDate} – {item.endDate}
                  </Text>

                  <Text style={styles.cardDays}>
                    ({item.days} hari)
                  </Text>
                </View>

                {/* COMPLETED */}
                {item.status === 'completed' && (
                  <View style={styles.ratingSection}>
                    <Text style={styles.ratingLabel}>
                      Rating Anda:
                    </Text>

                    {item.rating ? (
                      renderStars(item.rating)
                    ) : (
                      <TouchableOpacity
                        style={styles.rateBtn}
                      >
                        <Text
                          style={styles.rateBtnText}
                        >
                          Beri Ulasan
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {/* ACTIVE */}
                {item.status === 'active' && (
                  <View style={styles.activeActions}>
                    <TouchableOpacity
                      style={styles.actionChip}
                    >
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color={C.red}
                      />

                      <Text
                        style={styles.actionChipText}
                      >
                        Lacak Kendaraan
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionChip}
                    >
                      <Ionicons
                        name="call-outline"
                        size={14}
                        color="#4CAF50"
                      />

                      <Text
                        style={[
                          styles.actionChipText,
                          { color: '#4CAF50' },
                        ]}
                      >
                        Hubungi Sopir
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.black,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },

  backBtn: {
    width: 42,
    height: 42,
    backgroundColor: '#1A1A1A',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
  },

  summaryVal: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },

  summaryLabel: {
    color: C.muted,
    fontSize: 10,
    fontWeight: '600',
  },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },

  filterBtnActive: {
    backgroundColor: C.red,
    borderColor: C.red,
  },

  filterText: {
    color: C.muted,
    fontSize: 12,
    fontWeight: '600',
  },

  filterTextActive: {
    color: '#fff',
  },

  list: {
    paddingHorizontal: 20,
    gap: 14,
    paddingBottom: 100,
  },

  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    color: '#333',
    marginTop: 12,
    fontSize: 14,
  },

  rentalCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },

  cardImageContainer: {
    height: 140,
    position: 'relative',
  },

  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },

  cardBookingId: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },

  cardBody: {
    padding: 16,
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  cardBrand: {
    color: C.red,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },

  cardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  cardTotal: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },

  cardDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },

  cardDate: {
    color: C.muted,
    fontSize: 12,
  },

  cardDays: {
    color: '#555',
    fontSize: 11,
  },

  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  ratingLabel: {
    color: C.muted,
    fontSize: 12,
  },

  rateBtn: {
    backgroundColor: 'rgba(255,23,68,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,23,68,0.3)',
  },

  rateBtnText: {
    color: C.red,
    fontSize: 11,
    fontWeight: '700',
  },

  activeActions: {
    flexDirection: 'row',
    gap: 10,
  },

  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,23,68,0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,23,68,0.2)',
  },

  actionChipText: {
    color: C.red,
    fontSize: 12,
    fontWeight: '600',
  },
});