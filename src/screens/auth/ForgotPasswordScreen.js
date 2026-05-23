import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const C = { black: '#0A0A0A', red: '#FF1744', silver: '#C0C0C0', card: '#1A1A1A', muted: '#666' };

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Masukkan email yang valid'); return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 1500);
  };

  const handleVerifyOTP = () => {
    const code = otp.join('');
    if (code.length < 6) { Alert.alert('Error', 'Masukkan 6 digit kode OTP'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1000);
  };

  const handleResetPassword = () => {
    if (newPassword.length < 6) { Alert.alert('Error', 'Password minimal 6 karakter'); return; }
    if (newPassword !== confirmPassword) { Alert.alert('Error', 'Konfirmasi password tidak cocok'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('✅ Berhasil!', 'Password berhasil diubah. Silakan login.', [
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
    }, 1200);
  };

  const updateOtp = (val, index) => {
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
  };

  const steps = ['Verifikasi Email', 'Kode OTP', 'Password Baru'];

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step === 1 ? navigation.goBack() : setStep(step - 1)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lupa Password</Text>
        <View style={{ width: 42 }} />
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {steps.map((s, i) => (
          <View key={i} style={styles.stepItem}>
            <View style={[styles.stepDot, step > i && styles.stepDotDone, step === i + 1 && styles.stepDotActive]}>
              {step > i
                ? <Ionicons name="checkmark" size={12} color="#fff" />
                : <Text style={[styles.stepNum, step === i + 1 && { color: '#fff' }]}>{i + 1}</Text>
              }
            </View>
            <Text style={[styles.stepLabel, step === i + 1 && { color: '#fff' }]}>{s}</Text>
            {i < 2 && <View style={[styles.stepConnector, step > i + 1 && styles.stepConnectorDone]} />}
          </View>
        ))}
      </View>

      <View style={styles.content}>

        {/* STEP 1: Email */}
        {step === 1 && (
          <View>
            <View style={styles.iconBox}>
              <Ionicons name="mail" size={32} color={C.red} />
            </View>
            <Text style={styles.stepTitle}>Masukkan Email Anda</Text>
            <Text style={styles.stepDesc}>Kami akan mengirimkan kode verifikasi 6 digit ke email Anda</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color={C.muted} />
              <TextInput
                style={styles.input}
                placeholder="contoh@email.com"
                placeholderTextColor="#444"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity style={styles.actionBtn} onPress={handleSendOTP} disabled={loading}>
              <LinearGradient colors={['#FF1744', '#CC0000']} style={styles.actionGradient}>
                <Text style={styles.actionText}>{loading ? 'Mengirim...' : 'Kirim Kode OTP'}</Text>
                {!loading && <Ionicons name="arrow-forward" size={18} color="#fff" />}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <View>
            <View style={styles.iconBox}>
              <Ionicons name="keypad" size={32} color={C.red} />
            </View>
            <Text style={styles.stepTitle}>Kode Verifikasi</Text>
            <Text style={styles.stepDesc}>Kode OTP telah dikirim ke <Text style={{ color: C.silver }}>{email}</Text></Text>
            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  style={[styles.otpInput, digit && styles.otpInputFilled]}
                  value={digit}
                  onChangeText={val => updateOtp(val.slice(-1), i)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                />
              ))}
            </View>
            <TouchableOpacity style={styles.resendRow}>
              <Text style={styles.resendText}>Tidak menerima kode? <Text style={{ color: C.red }}>Kirim Ulang</Text></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleVerifyOTP} disabled={loading}>
              <LinearGradient colors={['#FF1744', '#CC0000']} style={styles.actionGradient}>
                <Text style={styles.actionText}>{loading ? 'Memverifikasi...' : 'Verifikasi'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3: New Password */}
        {step === 3 && (
          <View>
            <View style={styles.iconBox}>
              <Ionicons name="lock-closed" size={32} color={C.red} />
            </View>
            <Text style={styles.stepTitle}>Password Baru</Text>
            <Text style={styles.stepDesc}>Buat password baru yang kuat untuk akun Anda</Text>

            <Text style={styles.label}>Password Baru</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={18} color={C.muted} />
              <TextInput
                style={styles.input}
                placeholder="Minimal 6 karakter"
                placeholderTextColor="#444"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.muted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { marginTop: 14 }]}>Konfirmasi Password</Text>
            <View style={[styles.inputBox, confirmPassword && newPassword !== confirmPassword && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={18} color={C.muted} />
              <TextInput
                style={styles.input}
                placeholder="Ulangi password"
                placeholderTextColor="#444"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPass}
              />
            </View>
            {confirmPassword && newPassword !== confirmPassword
              ? <Text style={styles.errorText}>Password tidak cocok</Text>
              : null
            }

            {/* Strength indicator */}
            {newPassword.length > 0 && (
              <View style={styles.strengthBar}>
                {[1, 2, 3, 4].map(i => (
                  <View key={i} style={[styles.strengthSegment,
                    newPassword.length >= i * 3 && { backgroundColor: newPassword.length < 6 ? '#FF9800' : newPassword.length < 10 ? '#FFD700' : '#4CAF50' }
                  ]} />
                ))}
                <Text style={styles.strengthText}>
                  {newPassword.length < 6 ? 'Lemah' : newPassword.length < 10 ? 'Sedang' : 'Kuat'}
                </Text>
              </View>
            )}

            <TouchableOpacity style={[styles.actionBtn, { marginTop: 24 }]} onPress={handleResetPassword} disabled={loading}>
              <LinearGradient colors={['#FF1744', '#CC0000']} style={styles.actionGradient}>
                <Ionicons name="shield-checkmark" size={18} color="#fff" />
                <Text style={styles.actionText}>{loading ? 'Menyimpan...' : 'Simpan Password'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.black },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  backBtn: { width: 42, height: 42, backgroundColor: '#1A1A1A', borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },

  stepIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 24, marginBottom: 32, gap: 0 },
  stepItem: { alignItems: 'center', flex: 1, position: 'relative' },
  stepDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1A1A1A', borderWidth: 2, borderColor: '#333', alignItems: 'center', justifyContent: 'center', marginBottom: 6, zIndex: 1 },
  stepDotActive: { borderColor: C.red, backgroundColor: 'rgba(255,23,68,0.15)' },
  stepDotDone: { backgroundColor: C.red, borderColor: C.red },
  stepNum: { color: '#555', fontSize: 13, fontWeight: '800' },
  stepLabel: { color: '#555', fontSize: 10, fontWeight: '600', textAlign: 'center' },
  stepConnector: { position: 'absolute', top: 16, left: '60%', right: '-40%', height: 2, backgroundColor: '#2A2A2A', zIndex: 0 },
  stepConnectorDone: { backgroundColor: C.red },

  content: { paddingHorizontal: 24 },
  iconBox: { width: 72, height: 72, borderRadius: 22, backgroundColor: 'rgba(255,23,68,0.12)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,23,68,0.25)', marginBottom: 20 },
  stepTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 8 },
  stepDesc: { color: C.muted, fontSize: 13, lineHeight: 20, marginBottom: 28 },

  label: { color: C.silver, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', borderRadius: 14, paddingHorizontal: 14, gap: 10, borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 0 },
  inputError: { borderColor: C.red + '80' },
  input: { flex: 1, color: '#fff', fontSize: 14, paddingVertical: 16 },
  errorText: { color: C.red, fontSize: 11, marginTop: 6, marginLeft: 4 },

  otpRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 16 },
  otpInput: { width: 46, height: 56, backgroundColor: '#161616', borderRadius: 14, borderWidth: 1, borderColor: '#2A2A2A', color: '#fff', fontSize: 22, fontWeight: '900' },
  otpInputFilled: { borderColor: C.red, backgroundColor: 'rgba(255,23,68,0.08)' },

  resendRow: { alignItems: 'center', marginBottom: 24 },
  resendText: { color: C.muted, fontSize: 13 },

  actionBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  actionGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  actionText: { color: '#fff', fontWeight: '900', fontSize: 15, letterSpacing: 0.5 },

  strengthBar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  strengthSegment: { flex: 1, height: 4, backgroundColor: '#2A2A2A', borderRadius: 2 },
  strengthText: { color: C.muted, fontSize: 11, fontWeight: '600', minWidth: 44 },
});