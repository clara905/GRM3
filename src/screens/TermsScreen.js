import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const C = { black: '#0A0A0A', red: '#FF1744', silver: '#C0C0C0', muted: '#666' };

const TERMS = [
  {
    title: 'Persyaratan Penyewa',
    icon: 'person-circle-outline',
    content: [
      'Penyewa minimal berusia 21 tahun dan memiliki SIM A yang masih berlaku.',
      'Penyewa wajib menyerahkan fotokopi KTP/Paspor dan SIM A yang valid.',
      'Penyewa tidak diperkenankan memindahtangankan kendaraan kepada pihak ketiga.',
      'Penyewa dalam kondisi sehat jasmani dan rohani saat berkendara.',
    ],
  },
  {
    title: 'Pembayaran & Deposit',
    icon: 'card-outline',
    content: [
      'Pembayaran dilakukan di muka sebesar 100% dari total biaya sewa.',
      'Deposit sebesar 50% dari biaya sewa wajib dibayarkan sebelum kendaraan diserahkan.',
      'Deposit akan dikembalikan selambatnya 3 hari kerja setelah kendaraan dikembalikan.',
      'Pembatalan lebih dari 24 jam sebelum waktu sewa tidak dikenakan biaya.',
      'Pembatalan kurang dari 24 jam dikenakan biaya 50% dari total sewa.',
    ],
  },
  {
    title: 'Penggunaan Kendaraan',
    icon: 'car-sport-outline',
    content: [
      'Kendaraan hanya diperkenankan digunakan di wilayah Jabodetabek kecuali ada perjanjian khusus.',
      'Dilarang keras menggunakan kendaraan untuk balapan, latihan mengemudi, atau kegiatan ilegal.',
      'Penyewa wajib mematuhi peraturan lalu lintas yang berlaku.',
      'Kendaraan tidak boleh dimodifikasi dalam bentuk apapun.',
      'Merokok di dalam kendaraan dilarang keras. Pelanggaran dikenakan denda Rp 500.000.',
    ],
  },
  {
    title: 'Bahan Bakar',
    icon: 'flame-outline',
    content: [
      'Kendaraan diserahkan dalam kondisi tangki penuh.',
      'Penyewa wajib mengembalikan kendaraan dengan kondisi tangki penuh.',
      'Jika tangki tidak penuh, akan dikenakan biaya pengisian + surcharge 20%.',
      'Semua kendaraan Grand Wheels wajib menggunakan Pertamax Turbo (Ron 98).',
    ],
  },
  {
    title: 'Kecelakaan & Kerusakan',
    icon: 'warning-outline',
    content: [
      'Penyewa wajib melaporkan setiap kecelakaan atau kerusakan segera kepada tim Grand Wheels.',
      'Kerusakan akibat kelalaian penyewa menjadi tanggung jawab penuh penyewa.',
      'Asuransi dasar (TLO) sudah termasuk dalam biaya sewa.',
      'Kerusakan di luar cakupan asuransi dibebankan kepada penyewa.',
      'Grand Wheels tidak bertanggung jawab atas kehilangan barang pribadi di dalam kendaraan.',
    ],
  },
  {
    title: 'Pengembalian Kendaraan',
    icon: 'return-down-back-outline',
    content: [
      'Kendaraan wajib dikembalikan tepat waktu sesuai perjanjian.',
      'Keterlambatan pengembalian dikenakan biaya overtime Rp 500.000/jam.',
      'Kendaraan harus dikembalikan dalam kondisi bersih.',
      'Biaya cuci kendaraan sebesar Rp 300.000 dibebankan jika kendaraan dikembalikan kotor.',
    ],
  },
];

export default function TermsScreen({ navigation }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Syarat & Ketentuan</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.banner}>
          <Ionicons name="document-text" size={28} color={C.red} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Dokumen Penting</Text>
            <Text style={styles.bannerDesc}>Harap baca dan pahami sebelum memesan kendaraan</Text>
          </View>
        </View>

        <Text style={styles.lastUpdate}>Terakhir diperbarui: 1 Januari 2026</Text>

        {TERMS.map((section, i) => (
          <View key={i} style={styles.accordionItem}>
            <TouchableOpacity
              style={[styles.accordionHeader, expandedIndex === i && styles.accordionHeaderActive]}
              onPress={() => setExpandedIndex(expandedIndex === i ? -1 : i)}
            >
              <View style={[styles.sectionIcon, expandedIndex === i && styles.sectionIconActive]}>
                <Ionicons name={section.icon} size={18} color={expandedIndex === i ? C.red : C.muted} />
              </View>
              <Text style={[styles.sectionTitle, expandedIndex === i && styles.sectionTitleActive]}>
                {section.title}
              </Text>
              <Ionicons
                name={expandedIndex === i ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={expandedIndex === i ? C.red : C.muted}
              />
            </TouchableOpacity>

            {expandedIndex === i && (
              <View style={styles.accordionBody}>
                {section.content.map((item, j) => (
                  <View key={j} style={styles.termItem}>
                    <View style={styles.termDot} />
                    <Text style={styles.termText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#4CAF50" />
          <Text style={styles.footerText}>
            Dengan melakukan pemesanan, Anda menyetujui seluruh syarat dan ketentuan yang berlaku di Grand Wheels Rent.
          </Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.black },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  backBtn: { width: 42, height: 42, backgroundColor: '#1A1A1A', borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 20 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(255,23,68,0.08)', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,23,68,0.2)' },
  bannerTitle: { color: '#fff', fontSize: 15, fontWeight: '800', marginBottom: 2 },
  bannerDesc: { color: C.muted, fontSize: 12 },
  lastUpdate: { color: '#444', fontSize: 11, marginBottom: 20 },
  accordionItem: { backgroundColor: '#1A1A1A', borderRadius: 16, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#2A2A2A' },
  accordionHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  accordionHeaderActive: { borderBottomWidth: 1, borderBottomColor: '#2A2A2A' },
  sectionIcon: { width: 36, height: 36, backgroundColor: '#222', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionIconActive: { backgroundColor: 'rgba(255,23,68,0.12)' },
  sectionTitle: { flex: 1, color: '#aaa', fontSize: 14, fontWeight: '700' },
  sectionTitleActive: { color: '#fff' },
  accordionBody: { padding: 16, paddingTop: 12 },
  termItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  termDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.red, marginTop: 7, flexShrink: 0 },
  termText: { color: '#999', fontSize: 13, lineHeight: 20, flex: 1 },
  footer: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: 'rgba(76,175,80,0.08)', borderRadius: 14, padding: 14, marginTop: 10, borderWidth: 1, borderColor: 'rgba(76,175,80,0.2)' },
  footerText: { color: '#777', fontSize: 12, lineHeight: 18, flex: 1 },
});