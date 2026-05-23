import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  TextInput,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useAuth } from '../context/AuthContext';

// Konfigurasi Bahasa Indonesia untuk Kalender
LocaleConfig.locales['id'] = {
  monthNames: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
  monthNamesShort: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
  dayNames: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
  dayNamesShort: ['Min','Sen','Sel','Rab','Kam','Jum','Sab'],
  today: 'Hari ini',
};
LocaleConfig.defaultLocale = 'id';

const COLORS = {
  black: '#0A0A0A',
  red: '#FF1744',
  silver: '#C0C0C0',
  cardBg: '#1A1A1A',
  textSecondary: '#888',
};

const formatPrice = (price) =>
  'Rp ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const formatTime = (hour, minute) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

const toLocalDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getTodayString = () => toLocalDateString(new Date());

const parseLocalDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDateToLocal = (dateString) => {
  if (!dateString) return '';
  const months = [
    'Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Agustus','September','Oktober','November','Desember',
  ];
  const [year, month, day] = dateString.split('-');
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
};

const getReturnDateTime = (startDateString, pickupHour, pickupMinute, days) => {
  const date = parseLocalDate(startDateString);
  date.setHours(pickupHour, pickupMinute, 0, 0);
  date.setDate(date.getDate() + days);
  return {
    dateString: toLocalDateString(date),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
};

const buildMarkedDates = (start, end, accentColor) => {
  const marked = {};
  const current = parseLocalDate(start);
  const endDate = parseLocalDate(end);

  while (current <= endDate) {
    const key = toLocalDateString(current);
    marked[key] = {
      color: accentColor,
      textColor: '#fff',
      startingDay: key === start,
      endingDay: key === end,
    };
    current.setDate(current.getDate() + 1);
  }
  return marked;
};

const TIME_SLOTS = [];
for (let h = 7; h <= 21; h++) {
  TIME_SLOTS.push({ hour: h, minute: 0 });
  if (h < 21) TIME_SLOTS.push({ hour: h, minute: 30 });
}

export default function BookingScreen({ route, navigation }) {
  const { car } = route.params;

  const [days, setDays] = useState(1);
  const [withDriver, setWithDriver] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [pickupHour, setPickupHour] = useState(9);
  const [pickupMinute, setPickupMinute] = useState(0);

  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);

  // ── BARU: state alamat ──
  const [address, setAddress] = useState('');

  const PROMOS = {
    VROOM20: { discount: 0.2, label: 'Diskon 20% Weekend' },
    GRANDVIP: { discount: 0.15, label: 'VIP Member 15%' },
    NEWUSER: { discount: 0.1, label: 'New User 10%' },
  };

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMOS[code]) {
      setPromoApplied({ code, ...PROMOS[code] });
      Alert.alert('🎉 Promo Berhasil!', `Kode "${code}" — ${PROMOS[code].label}`);
    } else {
      Alert.alert('❌ Kode Tidak Valid', 'Periksa kembali kode promo Anda');
    }
  };

  const returnDateTime = getReturnDateTime(selectedDate, pickupHour, pickupMinute, days);
  const markedDates = buildMarkedDates(selectedDate, returnDateTime.dateString, COLORS.red);

  const driverCost = withDriver ? 500000 * days : 0;
  const subtotal = car.price * days;
  const deposit = subtotal * 0.5;
  const discountAmount = promoApplied
    ? Math.floor((subtotal + driverCost) * promoApplied.discount)
    : 0;
  const total = subtotal + driverCost - discountAmount;

  const handleConfirmBooking = () => {
    // ── BARU: validasi alamat ──
    if (!address.trim()) {
      Alert.alert('⚠️ Alamat Kosong', 'Mohon isi alamat pengambilan terlebih dahulu.');
      return;
    }

    navigation.push('Payment', {
      car,
      total,
      days,
      withDriver,
      startDate: `${formatDateToLocal(selectedDate)}, ${formatTime(pickupHour, pickupMinute)}`,
      returnDate: `${formatDateToLocal(returnDateTime.dateString)}, ${formatTime(returnDateTime.hour, returnDateTime.minute)}`,
      promoCode: promoApplied?.code || null,
      address: address.trim(), // ── BARU ──
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Pemesanan</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Car Summary */}
        <View style={styles.carSummary}>
          <Image source={{ uri: car.image }} style={styles.carThumb} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.carSummaryInfo}>
            <Text style={styles.summaryBrand}>{car.brand}</Text>
            <Text style={styles.summaryName}>{car.name}</Text>
            <Text style={styles.summaryPrice}>
              {formatPrice(car.price)}
              <Text style={{ fontSize: 12, color: '#aaa', fontWeight: '400' }}> /hari</Text>
            </Text>
          </View>
        </View>

        <View style={styles.formSection}>

          {/* Duration */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              <Ionicons name="calendar" size={16} color={COLORS.red} /> Durasi Sewa
            </Text>
            <View style={styles.daySelector}>
              <TouchableOpacity
                style={styles.dayBtn}
                onPress={() => setDays(Math.max(1, days - 1))}
              >
                <Ionicons name="remove" size={20} color="#fff" />
              </TouchableOpacity>
              <View style={styles.dayDisplay}>
                <Text style={styles.dayNumber}>{days}</Text>
                <Text style={styles.dayLabel}>Hari</Text>
              </View>
              <TouchableOpacity
                style={[styles.dayBtn, { backgroundColor: COLORS.red }]}
                onPress={() => setDays(days + 1)}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tanggal + Jam Ambil */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              <Ionicons name="time" size={16} color={COLORS.red} /> Tanggal & Jam Ambil
            </Text>

            <View style={styles.dateRangeRow}>
              <View style={[styles.dateChip, { borderColor: 'rgba(255,23,68,0.3)' }]}>
                <Ionicons name="log-in-outline" size={13} color={COLORS.red} />
                <Text style={styles.dateChipLabel}>AMBIL</Text>
                <Text style={styles.dateChipValue}>
                  {formatDateToLocal(selectedDate)}
                </Text>
                <Text style={styles.dateChipTime}>
                  {formatTime(pickupHour, pickupMinute)}
                </Text>
              </View>

              <View style={styles.durationBadge}>
                <Text style={styles.durationBadgeText}>{days}h</Text>
                <Ionicons name="arrow-forward" size={12} color="#555" />
              </View>

              <View style={[styles.dateChip, { borderColor: 'rgba(124,77,255,0.3)' }]}>
                <Ionicons name="log-out-outline" size={13} color="#7C4DFF" />
                <Text style={[styles.dateChipLabel, { color: '#7C4DFF' }]}>KEMBALI</Text>
                <Text style={[styles.dateChipValue, { color: '#7C4DFF' }]}>
                  {formatDateToLocal(returnDateTime.dateString)}
                </Text>
                <Text style={[styles.dateChipTime, { color: '#7C4DFF' }]}>
                  {formatTime(returnDateTime.hour, returnDateTime.minute)}
                </Text>
              </View>
            </View>

            <View style={styles.timeSectionHeader}>
              <Ionicons name="alarm-outline" size={14} color={COLORS.red} />
              <Text style={styles.timeSectionLabel}>Jam Ambil</Text>
              <View style={styles.selectedTimeBadge}>
                <Text style={styles.selectedTimeBadgeText}>
                  {formatTime(pickupHour, pickupMinute)}
                </Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeSlotList}
            >
              {TIME_SLOTS.map((slot, i) => {
                const isSelected = slot.hour === pickupHour && slot.minute === pickupMinute;
                const isHalfHour = slot.minute === 30;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.timeSlot,
                      isSelected && styles.timeSlotActive,
                      isHalfHour && styles.timeSlotHalf,
                    ]}
                    onPress={() => {
                      setPickupHour(slot.hour);
                      setPickupMinute(slot.minute);
                    }}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        isSelected && styles.timeSlotTextActive,
                        isHalfHour && !isSelected && styles.timeSlotTextHalf,
                      ]}
                    >
                      {formatTime(slot.hour, slot.minute)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Calendar
              current={selectedDate}
              minDate={getTodayString()}
              markingType="period"
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              enableSwipeMonths={true}
              theme={{
                backgroundColor: '#1A1A1A',
                calendarBackground: '#1A1A1A',
                textSectionTitleColor: '#666',
                selectedDayBackgroundColor: COLORS.red,
                selectedDayTextColor: '#ffffff',
                todayTextColor: COLORS.red,
                todayBackgroundColor: 'rgba(255,23,68,0.12)',
                dayTextColor: '#ffffff',
                textDisabledColor: '#333',
                dotColor: COLORS.red,
                selectedDotColor: '#ffffff',
                arrowColor: COLORS.red,
                disabledArrowColor: '#333',
                monthTextColor: '#ffffff',
                indicatorColor: COLORS.red,
                textDayFontWeight: '600',
                textMonthFontWeight: '800',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 14,
                textMonthFontSize: 15,
                textDayHeaderFontSize: 12,
              }}
              style={styles.calendar}
            />

            <Text style={styles.calendarHint}>
              <Ionicons name="information-circle-outline" size={12} color="#444" />
              {' '}Durasi dihitung 24 jam penuh dari jam ambil
            </Text>
          </View>

          {/* Add-ons */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              <Ionicons name="options" size={16} color={COLORS.red} /> Tambahan Layanan
            </Text>
            <TouchableOpacity
              style={[styles.addonItem, withDriver && styles.addonActive]}
              onPress={() => setWithDriver(!withDriver)}
            >
              <View style={styles.addonLeft}>
                <View style={[styles.addonIcon, { backgroundColor: '#7C4DFF20' }]}>
                  <Ionicons name="person" size={18} color="#7C4DFF" />
                </View>
                <View>
                  <Text style={styles.addonName}>Sopir Profesional</Text>
                  <Text style={styles.addonPrice}>+ Rp 500.000/hari</Text>
                </View>
              </View>
              <View style={[styles.checkbox, withDriver && styles.checkboxActive]}>
                {withDriver && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
            </TouchableOpacity>
          </View>

          {/* ── BARU: Alamat Pengambilan ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              <Ionicons name="location" size={16} color={COLORS.red} /> Alamat Pengambilan
            </Text>
            <TextInput
              style={[
                styles.addressInput,
                address.length > 0 && styles.addressInputFilled,
              ]}
              placeholder="Masukkan alamat lengkap pengambilan mobil..."
              placeholderTextColor="#444"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            {address.length > 0 && (
              <View style={styles.addressMeta}>
                <Ionicons name="checkmark-circle" size={13} color="#4CAF50" />
                <Text style={styles.addressMetaText}>Alamat tersimpan</Text>
              </View>
            )}
          </View>

          {/* Promo Code */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              <Ionicons name="pricetag" size={16} color={COLORS.red} /> Kode Promo
            </Text>
            {promoApplied ? (
              <View style={styles.promoAppliedBox}>
                <View style={styles.promoAppliedLeft}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <View>
                    <Text style={styles.promoAppliedCode}>{promoApplied.code}</Text>
                    <Text style={styles.promoAppliedLabel}>{promoApplied.label}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => { setPromoApplied(null); setPromoInput(''); }}>
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.promoInputRow}>
                  <TextInput
                    style={styles.promoInput}
                    placeholder="Masukkan kode promo"
                    placeholderTextColor="#444"
                    value={promoInput}
                    onChangeText={setPromoInput}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity style={styles.promoApplyBtn} onPress={applyPromo}>
                    <LinearGradient
                      colors={['#FF1744', '#CC0000']}
                      style={styles.promoApplyGradient}
                    >
                      <Text style={styles.promoApplyText}>Pakai</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <View style={styles.promoHints}>
                  {Object.keys(PROMOS).map((code) => (
                    <TouchableOpacity
                      key={code}
                      style={styles.promoHintChip}
                      onPress={() => setPromoInput(code)}
                    >
                      <Text style={styles.promoHintText}>{code}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>

          {/* Price Breakdown */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              <Ionicons name="receipt" size={16} color={COLORS.red} /> Rincian Harga
            </Text>
            {[
              { label: `Sewa ${days} hari`, value: formatPrice(subtotal) },
              ...(withDriver
                ? [{ label: `Sopir (${days} hari)`, value: formatPrice(driverCost) }]
                : []),
              { label: 'Deposit (50%)', value: formatPrice(deposit), note: 'Dikembalikan' },
            ].map((item, i) => (
              <View key={i} style={styles.priceRow}>
                <Text style={styles.priceRowLabel}>
                  {item.label}
                  {item.note && (
                    <Text style={{ color: '#4CAF50', fontSize: 10 }}> · {item.note}</Text>
                  )}
                </Text>
                <Text style={styles.priceRowValue}>{item.value}</Text>
              </View>
            ))}
            {promoApplied && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceRowLabel, { color: '#4CAF50' }]}>
                  Diskon ({promoApplied.code})
                </Text>
                <Text style={[styles.priceRowValue, { color: '#4CAF50' }]}>
                  - {formatPrice(discountAmount)}
                </Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total Pembayaran</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
          </View>

        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotal}>Total</Text>
          <Text style={styles.bottomTotalValue}>{formatPrice(total)}</Text>
        </View>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmBooking}>
          <LinearGradient
            colors={['#FF1744', '#CC0000']}
            style={styles.confirmGradient}
          >
            <Ionicons name="shield-checkmark" size={18} color="#fff" />
            <Text style={styles.confirmText}>Konfirmasi Pemesanan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },

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
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },

  carSummary: {
    height: 160,
    position: 'relative',
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  carThumb: { width: '100%', height: '100%', resizeMode: 'cover' },
  carSummaryInfo: { position: 'absolute', bottom: 16, left: 16 },
  summaryBrand: { color: COLORS.red, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  summaryName: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 4 },
  summaryPrice: { color: '#fff', fontSize: 16, fontWeight: '800' },

  formSection: { paddingHorizontal: 20, gap: 16 },

  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 16 },

  // Duration
  daySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  dayBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#2A2A2A',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDisplay: { alignItems: 'center', minWidth: 60 },
  dayNumber: { color: '#fff', fontSize: 32, fontWeight: '900' },
  dayLabel: { color: COLORS.textSecondary, fontSize: 12 },

  // Date range chips
  dateRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  dateChip: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    gap: 2,
  },
  dateChipLabel: {
    color: '#555',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
  },
  dateChipValue: {
    color: COLORS.red,
    fontSize: 11,
    fontWeight: '700',
  },
  dateChipTime: {
    color: COLORS.red,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  durationBadge: {
    alignItems: 'center',
    gap: 2,
  },
  durationBadgeText: {
    color: '#555',
    fontSize: 10,
    fontWeight: '700',
  },

  // Time picker
  timeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  timeSectionLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  selectedTimeBadge: {
    backgroundColor: 'rgba(255,23,68,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,23,68,0.3)',
  },
  selectedTimeBadgeText: {
    color: COLORS.red,
    fontSize: 13,
    fontWeight: '800',
  },
  timeSlotList: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 14,
  },
  timeSlot: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  timeSlotActive: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  timeSlotHalf: {
    borderColor: '#252525',
    backgroundColor: '#0D0D0D',
  },
  timeSlotText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
  },
  timeSlotTextActive: {
    color: '#fff',
    fontWeight: '800',
  },
  timeSlotTextHalf: {
    color: '#444',
  },

  // Calendar
  calendar: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  calendarHint: {
    color: '#444',
    fontSize: 11,
    marginTop: 10,
    lineHeight: 16,
  },

  // Addon
  addonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#333',
  },
  addonActive: {
    borderColor: COLORS.red + '60',
    backgroundColor: COLORS.red + '10',
  },
  addonLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  addonIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addonName: { color: '#fff', fontSize: 14, fontWeight: '600' },
  addonPrice: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: COLORS.red, borderColor: COLORS.red },

  // ── BARU: Address ──
  addressInput: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 88,
    lineHeight: 20,
  },
  addressInputFilled: {
    borderColor: 'rgba(255,23,68,0.4)',
    backgroundColor: 'rgba(255,23,68,0.05)',
  },
  addressMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  addressMetaText: {
    color: '#4CAF50',
    fontSize: 11,
    fontWeight: '600',
  },

  // Promo
  promoAppliedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(76,175,80,0.1)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.3)',
  },
  promoAppliedLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  promoAppliedCode: { color: '#4CAF50', fontWeight: '800', fontSize: 14 },
  promoAppliedLabel: { color: '#888', fontSize: 12, marginTop: 2 },
  promoInputRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  promoInput: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333',
    fontWeight: '700',
    letterSpacing: 1,
  },
  promoApplyBtn: { borderRadius: 12, overflow: 'hidden' },
  promoApplyGradient: { paddingHorizontal: 18, paddingVertical: 14, justifyContent: 'center' },
  promoApplyText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  promoHints: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  promoHintChip: {
    backgroundColor: 'rgba(255,23,68,0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,23,68,0.25)',
  },
  promoHintText: { color: COLORS.red, fontSize: 11, fontWeight: '700', letterSpacing: 1 },

  // Price breakdown
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  priceRowLabel: { color: COLORS.textSecondary, fontSize: 13 },
  priceRowValue: { color: '#fff', fontSize: 13, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#2A2A2A', marginVertical: 10 },
  totalLabel: { color: '#fff', fontSize: 15, fontWeight: '800' },
  totalValue: { color: COLORS.red, fontSize: 16, fontWeight: '900' },

  // Bottom bar
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
  bottomTotal: { color: COLORS.textSecondary, fontSize: 11 },
  bottomTotalValue: { color: '#fff', fontSize: 18, fontWeight: '900' },
  confirmBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  confirmText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});