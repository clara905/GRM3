import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import {
  MIDTRANS_CONFIG,
  createSnapToken,
  getMidtransSnapHTML,
  PAYMENT_STATUS,
} from '../services/MidtransService';

const C = {
  black: '#0A0A0A',
  red: '#FF1744',
  silver: '#C0C0C0',
  card: '#1A1A1A',
  muted: '#666',
};

const formatPrice = (p) =>
  'Rp ' + p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const PAYMENT_METHODS = [
  {
    id: 'bca_va',
    name: 'BCA Virtual Account',
    icon: 'business-outline',
    color: '#0056A0',
    desc: 'Transfer via ATM / M-Banking / Internet Banking BCA',
    badge: 'POPULER',
  },
  {
    id: 'bni_va',
    name: 'BNI Virtual Account',
    icon: 'business-outline',
    color: '#FF6600',
    desc: 'Transfer via ATM / M-Banking BNI',
    badge: null,
  },
  {
    id: 'mandiri_va',
    name: 'Mandiri Virtual Account',
    icon: 'business-outline',
    color: '#003F87',
    desc: 'Transfer via ATM / Livin by Mandiri',
    badge: null,
  },
  {
    id: 'bri_va',
    name: 'BRI Virtual Account',
    icon: 'business-outline',
    color: '#00529B',
    desc: 'Transfer via ATM / BRImo',
    badge: null,
  },
];

export default function PaymentScreen({ route, navigation }) {
  const { car, total, days, withDriver, promoCode } = route.params;
  const { addRental, user } = useAuth();

  const [selectedMethod, setSelectedMethod] = useState('bca_va');
  const [loadingToken, setLoadingToken] = useState(false);
  const [snapToken, setSnapToken] = useState(null);
  const [showWebView, setShowWebView] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const orderId = useRef(
    `GW-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`
  );

  /**
   * Step 1: Request Snap Token dari backend/simulasi
   */
  const handleProceedPayment = async () => {
    setLoadingToken(true);
    try {
      const tokenData = await createSnapToken({
        orderId: orderId.current,
        amount: total,
        car,
        user: user || {
          name: 'Guest',
          email: 'guest@grandwheels.com',
        },
        days,
        paymentMethod: selectedMethod,
      });
      setSnapToken(tokenData.token);
      setShowWebView(true);
    } catch (error) {
      Alert.alert(
        'Gagal',
        'Tidak dapat memuat halaman pembayaran. Coba lagi.'
      );
      console.error('Midtrans token error:', error);
    } finally {
      setLoadingToken(false);
    }
  };

  /**
   * Step 2: Handle pesan dari WebView (Midtrans Snap callbacks)
   * FIX: JSON.parse dibungkus try/catch agar tidak crash
   */
  const handleWebViewMessage = useCallback(
    (event) => {
      // FIX: safe parse — kalau data bukan JSON valid, langsung return
      let data = {};
      try {
        data = JSON.parse(event.nativeEvent.data);
      } catch (e) {
        console.log('WebView message bukan JSON, diabaikan:', event.nativeEvent.data);
        return;
      }

      console.log('Midtrans callback:', data);

      switch (data.type) {
        case 'PAYMENT_SUCCESS':
        case 'PAYMENT_PENDING':
          setShowWebView(false);
          setPaymentResult({
            type: data.type,
            orderId: orderId.current,
            result: data.result,
          });
          setShowResult(true);

          if (data.type === 'PAYMENT_SUCCESS') {
            addRental({
              id: orderId.current,
              carName: car.name,
              carBrand: car.brand,
              carImage: car.image,
              startDate: '21 Mei 2026',
              endDate: `${21 + days} Mei 2026`,
              days,
              total,
              status: 'active',
              rating: null,
              paymentMethod: selectedMethod,
              orderId: orderId.current,
            });
          }
          break;

        case 'PAYMENT_ERROR':
          setShowWebView(false);
          Alert.alert(
            '❌ Pembayaran Gagal',
            data.result?.status_message ||
              'Terjadi kesalahan saat pembayaran.',
            [
              {
                text: 'Coba Lagi',
                onPress: () => handleProceedPayment(),
              },
              { text: 'Batal' },
            ]
          );
          break;

        case 'PAYMENT_CLOSED':
          setShowWebView(false);
          Alert.alert(
            'Pembayaran Dibatalkan',
            'Anda menutup halaman pembayaran. Pesanan belum selesai.',
            [
              {
                text: 'Bayar Lagi',
                onPress: () => handleProceedPayment(),
              },
              { text: 'Nanti Saja', style: 'cancel' },
            ]
          );
          break;

        default:
          // type tidak dikenal, abaikan saja
          console.log('Unknown message type:', data.type);
          break;
      }
    },
    [car, days, total, selectedMethod]
  );

  /**
   * Render: Snap WebView Modal
   */
  const renderSnapWebView = () => (
    <Modal
      visible={showWebView}
      animationType="slide"
      onRequestClose={() => {
        Alert.alert(
          'Batalkan Pembayaran?',
          'Apakah Anda yakin ingin keluar dari halaman pembayaran?',
          [
            { text: 'Tetap di sini', style: 'cancel' },
            { text: 'Keluar', onPress: () => setShowWebView(false) },
          ]
        );
      }}
    >
      <View style={styles.webViewContainer}>
        {/* WebView Header */}
        <View style={styles.webViewHeader}>
          <TouchableOpacity
            style={styles.webViewClose}
            onPress={() =>
              Alert.alert(
                'Batalkan?',
                'Yakin ingin keluar dari halaman pembayaran?',
                [
                  { text: 'Tidak', style: 'cancel' },
                  {
                    text: 'Ya, Keluar',
                    onPress: () => setShowWebView(false),
                  },
                ]
              )
            }
          >
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.webViewTitle}>
            <Ionicons name="lock-closed" size={14} color="#4CAF50" />
            <Text style={styles.webViewTitleText}>
              Pembayaran Aman · Midtrans
            </Text>
          </View>

          <View style={styles.webViewOrderId}>
            <Text style={styles.webViewOrderIdText} numberOfLines={1}>
              {orderId.current}
            </Text>
          </View>
        </View>

        {/* Loading Overlay */}
        {webViewLoading && (
          <View style={styles.webViewLoading}>
            <ActivityIndicator size="large" color={C.red} />
            <Text style={styles.webViewLoadingText}>
              Memuat halaman Midtrans...
            </Text>
          </View>
        )}

        <WebView
          source={{
            html: getMidtransSnapHTML(
              snapToken,
              MIDTRANS_CONFIG.CLIENT_KEY
            ),
          }}
          onMessage={handleWebViewMessage}
          onLoadStart={() => setWebViewLoading(true)}
          onLoadEnd={() => setWebViewLoading(false)}
          javaScriptEnabled
          domStorageEnabled
          style={styles.webView}
        />
      </View>
    </Modal>
  );

  /**
   * Render: Payment Result Modal
   */
  const renderResultModal = () => {
    if (!paymentResult) return null;

    const isSuccess = paymentResult.type === 'PAYMENT_SUCCESS';
    const statusCfg = isSuccess
      ? PAYMENT_STATUS.settlement
      : PAYMENT_STATUS.pending;

    return (
      <Modal visible={showResult} animationType="fade" transparent>
        <View style={styles.resultOverlay}>
          <View style={styles.resultCard}>
            {/* Icon */}
            <View
              style={[
                styles.resultIconCircle,
                {
                  borderColor: statusCfg.color + '50',
                  backgroundColor: statusCfg.color + '15',
                },
              ]}
            >
              <Ionicons
                name={statusCfg.icon}
                size={44}
                color={statusCfg.color}
              />
            </View>

            <Text style={styles.resultTitle}>{statusCfg.label}</Text>
            <Text style={styles.resultSub}>
              {isSuccess
                ? `${car.name} siap untuk Anda!`
                : 'Silakan selesaikan pembayaran Anda'}
            </Text>

            {/* Detail Box */}
            <View style={styles.resultDetail}>
              {[
                { label: 'Order ID', val: paymentResult.orderId },
                { label: 'Kendaraan', val: car.name },
                { label: 'Durasi', val: `${days} hari` },
                { label: 'Total', val: formatPrice(total) },
                {
                  label: 'Status',
                  val: statusCfg.label,
                  color: statusCfg.color,
                },
              ].map((item, i) => (
                <View key={i} style={styles.resultRow}>
                  <Text style={styles.resultRowLabel}>{item.label}</Text>
                  <Text
                    style={[
                      styles.resultRowVal,
                      item.color && { color: item.color },
                    ]}
                  >
                    {item.val}
                  </Text>
                </View>
              ))}
            </View>

            {isSuccess ? (
              <TouchableOpacity
                style={styles.resultBtn}
                onPress={() => {
                  setShowResult(false);
                  // FIX: push ke HomeMain agar tidak stuck di stack
                  navigation.push('HomeMain');
                }}
              >
                <LinearGradient
                  colors={['#4CAF50', '#388E3C']}
                  style={styles.resultBtnGradient}
                >
                  <Ionicons name="home" size={18} color="#fff" />
                  <Text style={styles.resultBtnText}>
                    Kembali ke Beranda
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={styles.resultBtnRow}>
                <TouchableOpacity
                  style={[styles.resultBtn, { flex: 1 }]}
                  onPress={() => {
                    setShowResult(false);
                    handleProceedPayment();
                  }}
                >
                  <LinearGradient
                    colors={['#FF1744', '#CC0000']}
                    style={styles.resultBtnGradient}
                  >
                    <Text style={styles.resultBtnText}>Bayar Sekarang</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.resultBtnOutline, { flex: 1 }]}
                  onPress={() => {
                    setShowResult(false);
                    // FIX: push ke HomeMain agar tidak stuck di stack
                    navigation.push('HomeMain');
                  }}
                >
                  <Text style={styles.resultBtnOutlineText}>Nanti Saja</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Metode Pembayaran</Text>
          <View style={styles.secureTag}>
            <Ionicons name="shield-checkmark" size={11} color="#4CAF50" />
            <Text style={styles.secureText}>Diproses oleh Midtrans</Text>
          </View>
        </View>

        <View style={{ width: 42 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Order Card */}
        <View style={styles.orderCard}>
          <Image source={{ uri: car.image }} style={styles.orderImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.orderInfo}>
            <Text style={styles.orderBrand}>{car.brand}</Text>
            <Text style={styles.orderName}>{car.name}</Text>
            <View style={styles.orderTagRow}>
              <View style={styles.orderTag}>
                <Ionicons name="calendar-outline" size={11} color="#aaa" />
                <Text style={styles.orderTagText}>{days} hari</Text>
              </View>

              {withDriver && (
                <View style={styles.orderTag}>
                  <Ionicons name="person-outline" size={11} color="#aaa" />
                  <Text style={styles.orderTagText}>+ Sopir</Text>
                </View>
              )}

              {promoCode && (
                <View
                  style={[
                    styles.orderTag,
                    { borderColor: 'rgba(76,175,80,0.4)' },
                  ]}
                >
                  <Ionicons
                    name="pricetag-outline"
                    size={11}
                    color="#4CAF50"
                  />
                  <Text
                    style={[styles.orderTagText, { color: '#4CAF50' }]}
                  >
                    {promoCode}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.orderTotalBlock}>
            <Text style={styles.orderTotalLabel}>Total</Text>
            <Text style={styles.orderTotalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        {/* Order ID */}
        <View style={styles.orderIdRow}>
          <Text style={styles.orderIdLabel}>Order ID:</Text>
          <Text style={styles.orderIdValue}>{orderId.current}</Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pilih Metode Pembayaran</Text>
          <Text style={styles.sectionSub}>
            Semua metode diproses aman via Midtrans
          </Text>
        </View>

        <View style={styles.methodsContainer}>
          {PAYMENT_METHODS.map((pm) => (
            <TouchableOpacity
              key={pm.id}
              style={[
                styles.methodCard,
                selectedMethod === pm.id && styles.methodCardActive,
              ]}
              onPress={() => setSelectedMethod(pm.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.methodIconBg,
                  { backgroundColor: pm.color + '18' },
                ]}
              >
                <Ionicons name={pm.icon} size={22} color={pm.color} />
              </View>

              <View style={styles.methodInfo}>
                <View style={styles.methodNameRow}>
                  <Text style={styles.methodName}>{pm.name}</Text>
                  {pm.badge && (
                    <View style={styles.methodBadge}>
                      <Text style={styles.methodBadgeText}>{pm.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.methodDesc}>{pm.desc}</Text>
              </View>

              <View
                style={[
                  styles.radio,
                  selectedMethod === pm.id && styles.radioActive,
                ]}
              >
                {selectedMethod === pm.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Midtrans Trust Badges */}
        <View style={styles.trustBox}>
          {[
            {
              icon: 'shield-checkmark',
              text: 'SSL 256-bit Encrypted',
              color: '#4CAF50',
            },
            {
              icon: 'lock-closed',
              text: 'PCI-DSS Compliant',
              color: '#2196F3',
            },
            {
              icon: 'eye-off',
              text: 'Data Anda Aman & Private',
              color: '#9C27B0',
            },
          ].map((t, i) => (
            <View key={i} style={styles.trustItem}>
              <Ionicons name={t.icon} size={16} color={t.color} />
              <Text style={styles.trustText}>{t.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total Pembayaran</Text>
          <Text style={styles.bottomTotal}>{formatPrice(total)}</Text>
        </View>

        <TouchableOpacity
          style={styles.payBtn}
          onPress={() => {
            // FIX: console.log untuk debug, hapus setelah confirmed working
            console.log('BAYAR BUTTON PRESSED, navigating to payment...');
            handleProceedPayment();
          }}
          disabled={loadingToken}
        >
          <LinearGradient
            colors={['#FF1744', '#CC0000']}
            style={styles.payGradient}
          >
            {loadingToken ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.payText}>Memproses...</Text>
              </>
            ) : (
              <>
                <Ionicons name="shield-checkmark" size={18} color="#fff" />
                <Text style={styles.payText}>Bayar via Midtrans</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Midtrans WebView Modal */}
      {renderSnapWebView()}

      {/* Payment Result Modal */}
      {renderResultModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.black },

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
  headerCenter: { alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  secureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  secureText: { color: '#4CAF50', fontSize: 10, fontWeight: '600' },

  orderCard: {
    height: 150,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
  },
  orderImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  orderInfo: { position: 'absolute', bottom: 14, left: 14 },
  orderBrand: {
    color: C.red,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  orderName: { color: '#fff', fontSize: 16, fontWeight: '900', marginBottom: 8 },
  orderTagRow: { flexDirection: 'row', gap: 6 },
  orderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  orderTagText: { color: '#aaa', fontSize: 10, fontWeight: '600' },
  orderTotalBlock: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    alignItems: 'flex-end',
  },
  orderTotalLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    marginBottom: 2,
  },
  orderTotalValue: { color: '#fff', fontSize: 17, fontWeight: '900' },

  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  orderIdLabel: { color: C.muted, fontSize: 11 },
  orderIdValue: {
    color: '#555',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  sectionHeader: { paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '800', marginBottom: 3 },
  sectionSub: { color: C.muted, fontSize: 12 },

  methodsContainer: { paddingHorizontal: 20, gap: 10 },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1.5,
    borderColor: '#252525',
  },
  methodCardActive: {
    borderColor: C.red + '70',
    backgroundColor: 'rgba(255,23,68,0.06)',
  },
  methodIconBg: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfo: { flex: 1 },
  methodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  methodName: { color: '#fff', fontSize: 14, fontWeight: '700' },
  methodBadge: {
    backgroundColor: 'rgba(255,23,68,0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,23,68,0.3)',
  },
  methodBadgeText: {
    color: C.red,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  methodDesc: { color: C.muted, fontSize: 11, lineHeight: 16 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: C.red },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.red,
  },

  trustBox: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trustText: { color: '#555', fontSize: 12, fontWeight: '500' },

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
    borderTopColor: '#252525',
  },
  bottomLabel: { color: C.muted, fontSize: 11, marginBottom: 2 },
  bottomTotal: { color: '#fff', fontSize: 18, fontWeight: '900' },
  payBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  payGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  payText: { color: '#fff', fontWeight: '900', fontSize: 15 },

  // WebView
  webViewContainer: { flex: 1, backgroundColor: '#0A0A0A' },
  webViewHeader: {
    backgroundColor: '#141414',
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  webViewClose: {
    width: 36,
    height: 36,
    backgroundColor: '#1A1A1A',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webViewTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'center',
  },
  webViewTitleText: { color: '#aaa', fontSize: 13, fontWeight: '600' },
  webViewOrderId: { maxWidth: 110 },
  webViewOrderIdText: {
    color: '#444',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'right',
  },
  webViewLoading: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  webViewLoadingText: { color: '#555', fontSize: 13, marginTop: 12 },
  webView: { flex: 1, backgroundColor: '#0A0A0A' },

  // Result Modal
  resultOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  resultCard: {
    backgroundColor: '#141414',
    borderRadius: 28,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  resultIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 20,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
    textAlign: 'center',
  },
  resultSub: {
    color: C.muted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  resultDetail: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 10,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultRowLabel: { color: C.muted, fontSize: 13 },
  resultRowVal: { color: '#fff', fontSize: 13, fontWeight: '700' },
  resultBtn: { borderRadius: 14, overflow: 'hidden', width: '100%' },
  resultBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  resultBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  resultBtnRow: { flexDirection: 'row', gap: 10, width: '100%' },
  resultBtnOutline: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  resultBtnOutlineText: { color: '#777', fontWeight: '700', fontSize: 14 },
});