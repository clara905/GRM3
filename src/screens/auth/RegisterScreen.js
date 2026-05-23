import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, Alert, KeyboardAvoidingView, Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const C = {
  black: '#0A0A0A',
  red: '#FF1744',
  silver: '#C0C0C0',
  card: '#1A1A1A',
  muted: '#666',
};

const InputField = ({ label, icon, error, ...props }) => (
  <View style={regStyles.fieldGroup}>
    <Text style={regStyles.label}>{label}</Text>
    <View style={[regStyles.inputBox, error && regStyles.inputError]}>
      <Ionicons name={icon} size={18} color={error ? C.red : C.muted} />
      <TextInput style={regStyles.input} placeholderTextColor="#444" {...props} />
    </View>
    {error ? <Text style={regStyles.errorText}>{error}</Text> : null}
  </View>
);

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referral: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState(1); // 1=data diri, 2=verifikasi

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: '' }));
  };

  const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return { score: 0, label: '', color: 'transparent' };
    if (pwd.length < 6) return { score: 1, label: 'Lemah', color: '#F44336' };
    if (pwd.length < 10) return { score: 2, label: 'Sedang', color: '#FF9800' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { score: 4, label: 'Sangat Kuat', color: '#4CAF50' };
    return { score: 3, label: 'Kuat', color: '#8BC34A' };
  };

  const strength = getPasswordStrength(form.password);

  const validateStep1 = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Nama lengkap wajib diisi';
    else if (form.fullName.trim().length < 3) e.fullName = 'Nama minimal 3 karakter';
    if (!form.email) e.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email tidak valid';
    if (!form.phone) e.phone = 'Nomor HP wajib diisi';
    else if (!/^(08|\+62)[0-9]{8,11}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Format nomor HP tidak valid (cth: 08123456789)';
    if (!form.password) e.password = 'Password wajib diisi';
    else if (form.password.length < 6) e.password = 'Password minimal 6 karakter';
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Konfirmasi password tidak cocok';
    if (!agreed) e.agreed = 'Anda harus menyetujui syarat & ketentuan';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateStep1()) return;
    setStep(2);
  };

  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      register({
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        member: 'Silver',
      });
      Alert.alert(
        '🎉 Registrasi Berhasil!',
        `Selamat datang, ${form.fullName}!\nAkun Anda telah dibuat dengan member Silver.`,
        [{ text: 'Mulai Berkendara', style: 'default' }]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={regStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={regStyles.header}>
          <TouchableOpacity
            onPress={() => (step === 1 ? navigation.goBack() : setStep(1))}
            style={regStyles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={regStyles.headerTitle}>
            {step === 1 ? 'Buat Akun Baru' : 'Verifikasi Akun'}
          </Text>
          <View style={{ width: 42 }} />
        </View>

        {/* Progress Bar */}
        <View style={regStyles.progressContainer}>
          <View style={regStyles.progressTrack}>
            <LinearGradient
              colors={['#FF1744', '#CC0000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[regStyles.progressBar, { width: step === 1 ? '50%' : '100%' }]}
            />
          </View>
          <View style={regStyles.progressSteps}>
            {['Data Diri', 'Verifikasi'].map((label, i) => (
              <View key={i} style={regStyles.progressStep}>
                <View
                  style={[
                    regStyles.stepCircle,
                    step > i && regStyles.stepCircleDone,
                    step === i + 1 && regStyles.stepCircleActive,
                  ]}
                >
                  {step > i + 1 ? (
                    <Ionicons name="checkmark" size={13} color="#fff" />
                  ) : (
                    <Text
                      style={[
                        regStyles.stepNum,
                        step === i + 1 && { color: '#fff' },
                      ]}
                    >
                      {i + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    regStyles.stepLabel,
                    step === i + 1 && { color: '#fff' },
                    step > i + 1 && { color: '#4CAF50' },
                  ]}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={regStyles.content}>
          {step === 1 ? (
            <>
              {/* Logo mini */}
              <View style={regStyles.logoRow}>
                <View style={regStyles.logoIcon}>
                  <Ionicons name="car-sport" size={22} color={C.red} />
                </View>
                <Text style={regStyles.logoText}>
                  GRAND <Text style={{ color: C.red }}>WHEELS</Text>
                </Text>
              </View>

              <Text style={regStyles.heading}>Isi Data Diri</Text>
              <Text style={regStyles.subHeading}>
                Lengkapi informasi berikut untuk membuat akun
              </Text>

              {/* Full Name */}
              <InputField
                label="Nama Lengkap"
                icon="person-outline"
                placeholder="Sesuai KTP"
                value={form.fullName}
                onChangeText={(v) => set('fullName', v)}
                error={errors.fullName}
              />

              {/* Email */}
              <InputField
                label="Email"
                icon="mail-outline"
                placeholder="contoh@email.com"
                value={form.email}
                onChangeText={(v) => set('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              {/* Phone */}
              <InputField
                label="Nomor HP (WhatsApp)"
                icon="phone-portrait-outline"
                placeholder="08123456789"
                value={form.phone}
                onChangeText={(v) => set('phone', v)}
                keyboardType="phone-pad"
                error={errors.phone}
              />

              {/* Password */}
              <View style={regStyles.fieldGroup}>
                <Text style={regStyles.label}>Password</Text>
                <View
                  style={[
                    regStyles.inputBox,
                    errors.password && regStyles.inputError,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={errors.password ? C.red : C.muted}
                  />
                  <TextInput
                    style={regStyles.input}
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor="#444"
                    value={form.password}
                    onChangeText={(v) => set('password', v)}
                    secureTextEntry={!showPass}
                  />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    <Ionicons
                      name={showPass ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={C.muted}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password ? (
                  <Text style={regStyles.errorText}>{errors.password}</Text>
                ) : null}
                {/* Strength Bar */}
                {form.password.length > 0 && (
                  <View style={regStyles.strengthRow}>
                    {[1, 2, 3, 4].map((i) => (
                      <View
                        key={i}
                        style={[
                          regStyles.strengthSeg,
                          strength.score >= i && {
                            backgroundColor: strength.color,
                          },
                        ]}
                      />
                    ))}
                    <Text
                      style={[regStyles.strengthLabel, { color: strength.color }]}
                    >
                      {strength.label}
                    </Text>
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View style={regStyles.fieldGroup}>
                <Text style={regStyles.label}>Konfirmasi Password</Text>
                <View
                  style={[
                    regStyles.inputBox,
                    errors.confirmPassword && regStyles.inputError,
                  ]}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color={errors.confirmPassword ? C.red : C.muted}
                  />
                  <TextInput
                    style={regStyles.input}
                    placeholder="Ulangi password"
                    placeholderTextColor="#444"
                    value={form.confirmPassword}
                    onChangeText={(v) => set('confirmPassword', v)}
                    secureTextEntry={!showConfirm}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                    <Ionicons
                      name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={C.muted}
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? (
                  <Text style={regStyles.errorText}>
                    {errors.confirmPassword}
                  </Text>
                ) : null}
                {form.confirmPassword &&
                  form.password === form.confirmPassword && (
                    <View style={regStyles.matchRow}>
                      <Ionicons
                        name="checkmark-circle"
                        size={13}
                        color="#4CAF50"
                      />
                      <Text style={regStyles.matchText}>Password cocok</Text>
                    </View>
                  )}
              </View>

              {/* Referral (opsional) */}
              <View style={regStyles.fieldGroup}>
                <Text style={regStyles.label}>
                  Kode Referral{' '}
                  <Text style={{ color: C.muted, fontWeight: '400' }}>
                    (Opsional)
                  </Text>
                </Text>
                <View style={regStyles.inputBox}>
                  <Ionicons name="gift-outline" size={18} color={C.muted} />
                  <TextInput
                    style={regStyles.input}
                    placeholder="Masukkan kode referral"
                    placeholderTextColor="#444"
                    value={form.referral}
                    onChangeText={(v) => set('referral', v.toUpperCase())}
                    autoCapitalize="characters"
                  />
                </View>
                <Text style={regStyles.hintText}>
                  💡 Dapatkan diskon 10% untuk sewa pertama
                </Text>
              </View>

              {/* Agreement */}
              <TouchableOpacity
                style={regStyles.agreeRow}
                onPress={() => {
                  setAgreed(!agreed);
                  setErrors((p) => ({ ...p, agreed: '' }));
                }}
              >
                <View
                  style={[
                    regStyles.checkbox,
                    agreed && regStyles.checkboxActive,
                    errors.agreed && regStyles.checkboxError,
                  ]}
                >
                  {agreed && (
                    <Ionicons name="checkmark" size={13} color="#fff" />
                  )}
                </View>
                <Text style={regStyles.agreeText}>
                  Saya menyetujui{' '}
                  <Text style={{ color: C.red }}>Syarat & Ketentuan</Text> serta{' '}
                  <Text style={{ color: C.red }}>Kebijakan Privasi</Text> Grand
                  Wheels Rent
                </Text>
              </TouchableOpacity>
              {errors.agreed ? (
                <Text style={[regStyles.errorText, { marginTop: -8 }]}>
                  {errors.agreed}
                </Text>
              ) : null}

              {/* Member benefit chips */}
              <View style={regStyles.benefitsBox}>
                <Text style={regStyles.benefitsTitle}>
                  🎁 Benefit Member Baru
                </Text>
                {[
                  'Status awal: Silver Member',
                  'Diskon 10% sewa pertama',
                  'Akses 50+ armada premium',
                  'Support 24/7 via WhatsApp',
                ].map((b, i) => (
                  <View key={i} style={regStyles.benefitItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color="#4CAF50"
                    />
                    <Text style={regStyles.benefitText}>{b}</Text>
                  </View>
                ))}
              </View>

              {/* Next Button */}
              <TouchableOpacity
                style={regStyles.actionBtn}
                onPress={handleNext}
              >
                <LinearGradient
                  colors={['#FF1744', '#CC0000']}
                  style={regStyles.actionGradient}
                >
                  <Text style={regStyles.actionText}>Lanjut Verifikasi</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={regStyles.loginHintRow}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={regStyles.loginHint}>
                  Sudah punya akun?{' '}
                  <Text style={{ color: C.red, fontWeight: '700' }}>
                    Masuk
                  </Text>
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            /* ── STEP 2: Verifikasi ── */
            <>
              <View style={regStyles.verifyBox}>
                <View style={regStyles.verifyIcon}>
                  <Ionicons name="mail" size={36} color={C.red} />
                </View>
                <Text style={regStyles.verifyTitle}>Cek Email Anda</Text>
                <Text style={regStyles.verifyDesc}>
                  Kode verifikasi telah dikirim ke
                </Text>
                <Text style={regStyles.verifyEmail}>{form.email}</Text>

                {/* OTP Input */}
                <View style={regStyles.otpRow}>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <View key={i} style={regStyles.otpBox}>
                      <Text style={regStyles.otpPlaceholder}>•</Text>
                    </View>
                  ))}
                </View>
                <Text style={regStyles.otpNote}>
                  Demo: tidak perlu input OTP nyata
                </Text>

                {/* Summary */}
                <View style={regStyles.summaryBox}>
                  {[
                    { label: 'Nama', val: form.fullName },
                    { label: 'Email', val: form.email },
                    { label: 'HP', val: form.phone },
                    { label: 'Member', val: 'Silver (Baru)' },
                  ].map((s, i) => (
                    <View key={i} style={regStyles.summaryRow}>
                      <Text style={regStyles.summaryLabel}>{s.label}</Text>
                      <Text style={regStyles.summaryVal}>{s.val}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={regStyles.actionBtn}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['#FF1744', '#CC0000']}
                    style={regStyles.actionGradient}
                  >
                    <Ionicons name="shield-checkmark" size={18} color="#fff" />
                    <Text style={regStyles.actionText}>
                      {loading ? 'Membuat Akun...' : 'Konfirmasi & Daftar'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 12, alignItems: 'center' }}>
                  <Text style={{ color: C.muted, fontSize: 13 }}>
                    Tidak menerima kode?{' '}
                    <Text style={{ color: C.red }}>Kirim Ulang</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const regStyles = StyleSheet.create({
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
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },

  progressContainer: { paddingHorizontal: 24, marginBottom: 24 },
  progressTrack: {
    height: 3,
    backgroundColor: '#222',
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', borderRadius: 2 },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStep: { alignItems: 'center', gap: 6 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: { borderColor: C.red, backgroundColor: 'rgba(255,23,68,0.12)' },
  stepCircleDone: { backgroundColor: C.red, borderColor: C.red },
  stepNum: { color: '#555', fontSize: 12, fontWeight: '800' },
  stepLabel: { color: '#555', fontSize: 11, fontWeight: '600' },

  content: { paddingHorizontal: 24 },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,23,68,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,23,68,0.3)',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 3,
  },
  heading: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 6 },
  subHeading: { color: C.muted, fontSize: 13, lineHeight: 20, marginBottom: 24 },

  fieldGroup: { marginBottom: 16 },
  label: {
    color: C.silver,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 14,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  inputError: { borderColor: C.red + '80' },
  input: { flex: 1, color: '#fff', fontSize: 14, paddingVertical: 16 },
  errorText: { color: C.red, fontSize: 11, marginTop: 6, marginLeft: 4 },
  hintText: {
    color: '#555',
    fontSize: 11,
    marginTop: 6,
    marginLeft: 4,
  },

  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  strengthSeg: {
    flex: 1,
    height: 4,
    backgroundColor: '#2A2A2A',
    borderRadius: 2,
  },
  strengthLabel: { fontSize: 11, fontWeight: '700', minWidth: 60 },

  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    marginLeft: 4,
  },
  matchText: { color: '#4CAF50', fontSize: 11 },

  agreeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
    backgroundColor: '#161616',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  checkboxActive: { backgroundColor: C.red, borderColor: C.red },
  checkboxError: { borderColor: C.red },
  agreeText: { color: '#aaa', fontSize: 13, lineHeight: 20, flex: 1 },

  benefitsBox: {
    backgroundColor: '#0F1F0F',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.25)',
  },
  benefitsTitle: { color: '#fff', fontSize: 13, fontWeight: '800', marginBottom: 12 },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  benefitText: { color: '#aaa', fontSize: 12 },

  actionBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  actionText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  loginHintRow: { alignItems: 'center', marginBottom: 8 },
  loginHint: { color: C.muted, fontSize: 13 },

  // Step 2 styles
  verifyBox: { alignItems: 'center' },
  verifyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,23,68,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,23,68,0.25)',
    marginBottom: 20,
  },
  verifyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  verifyDesc: { color: C.muted, fontSize: 14, marginBottom: 4 },
  verifyEmail: {
    color: C.silver,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 24,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  otpBox: {
    width: 46,
    height: 56,
    backgroundColor: '#161616',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpPlaceholder: { color: '#444', fontSize: 20 },
  otpNote: { color: '#444', fontSize: 11, marginBottom: 24 },
  summaryBox: {
    width: '100%',
    backgroundColor: '#161616',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: { color: C.muted, fontSize: 13 },
  summaryVal: { color: '#fff', fontSize: 13, fontWeight: '700' },
});