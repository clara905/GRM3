import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const C = { black: '#0A0A0A', red: '#FF1744', silver: '#C0C0C0', card: '#1A1A1A', muted: '#666' };

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Format email tidak valid';
    if (!password) e.password = 'Password wajib diisi';
    else if (password.length < 6) e.password = 'Password minimal 6 karakter';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      setLoading(false);
      if (!success) Alert.alert('Login Gagal', 'Email atau password salah.');
    }, 1200);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="car-sport" size={36} color={C.red} />
          </View>
          <Text style={styles.logoTitle}>GRAND <Text style={{ color: C.red }}>WHEELS</Text></Text>
          <Text style={styles.logoSub}>Premium Car Rental</Text>
        </View>

        {/* Decorative line */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <View style={styles.redDot} />
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.heading}>Selamat Datang</Text>
        <Text style={styles.subHeading}>Masuk untuk menikmati pengalaman berkendara mewah</Text>

        {/* Email */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={[styles.inputBox, errors.email && styles.inputError]}>
            <Ionicons name="mail-outline" size={18} color={errors.email ? C.red : C.muted} />
            <TextInput
              style={styles.input}
              placeholder="contoh@email.com"
              placeholderTextColor="#444"
              value={email}
              onChangeText={t => { setEmail(t); setErrors(p => ({ ...p, email: '' })); }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        {/* Password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={[styles.inputBox, errors.password && styles.inputError]}>
            <Ionicons name="lock-closed-outline" size={18} color={errors.password ? C.red : C.muted} />
            <TextInput
              style={styles.input}
              placeholder="Minimal 6 karakter"
              placeholderTextColor="#444"
              value={password}
              onChangeText={t => { setPassword(t); setErrors(p => ({ ...p, password: '' })); }}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.muted} />
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        {/* Forgot */}
        <TouchableOpacity style={styles.forgotRow} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Lupa Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          <LinearGradient colors={['#FF1744', '#CC0000']} style={styles.loginGradient}>
            {loading
              ? <Text style={styles.loginText}>Memverifikasi...</Text>
              : <>
                  <Ionicons name="log-in-outline" size={20} color="#fff" />
                  <Text style={styles.loginText}>MASUK</Text>
                </>
            }
          </LinearGradient>
        </TouchableOpacity>

        {/* Demo hint */}
        <View style={styles.demoBox}>
          <Ionicons name="information-circle-outline" size={15} color={C.muted} />
          <Text style={styles.demoText}>Demo: gunakan email apapun + password 6 karakter</Text>
        </View>

        {/* Divider */}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>ATAU</Text>
          <View style={styles.orLine} />
        </View>

        {/* Social Login */}
        {['Google', 'Apple'].map((provider, i) => (
          <TouchableOpacity key={i} style={styles.socialBtn} onPress={() => Alert.alert(`Login dengan ${provider}`, 'Fitur segera hadir!')}>
            <Ionicons name={provider === 'Google' ? 'logo-google' : 'logo-apple'} size={18} color="#fff" />
            <Text style={styles.socialText}>Lanjut dengan {provider}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.registerHint}>
          Belum punya akun?{' '}
          <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>Daftar Sekarang</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.black },
  scroll: { paddingHorizontal: 24, paddingTop: 70, paddingBottom: 40 },

  logoSection: { alignItems: 'center', marginBottom: 28 },
  logoCircle: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(255,23,68,0.12)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,23,68,0.3)', marginBottom: 14 },
  logoTitle: { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: 4 },
  logoSub: { color: C.muted, fontSize: 12, letterSpacing: 2, marginTop: 4 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#222' },
  redDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.red, marginHorizontal: 10 },

  heading: { color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 6 },
  subHeading: { color: C.muted, fontSize: 13, lineHeight: 20, marginBottom: 28 },

  fieldGroup: { marginBottom: 16 },
  label: { color: C.silver, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', borderRadius: 14, paddingHorizontal: 14, gap: 10, borderWidth: 1, borderColor: '#2A2A2A' },
  inputError: { borderColor: C.red + '80' },
  input: { flex: 1, color: '#fff', fontSize: 14, paddingVertical: 16 },
  errorText: { color: C.red, fontSize: 11, marginTop: 6, marginLeft: 4 },

  forgotRow: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { color: C.red, fontSize: 13, fontWeight: '600' },

  loginBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  loginGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  loginText: { color: '#fff', fontWeight: '900', fontSize: 15, letterSpacing: 1.5 },

  demoBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#161616', borderRadius: 10, padding: 12, marginBottom: 24 },
  demoText: { color: C.muted, fontSize: 11, flex: 1 },

  orRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  orLine: { flex: 1, height: 1, backgroundColor: '#222' },
  orText: { color: '#444', fontSize: 11, fontWeight: '700', letterSpacing: 2, marginHorizontal: 12 },

  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#1A1A1A', borderRadius: 14, paddingVertical: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2A2A2A' },
  socialText: { color: '#ccc', fontWeight: '600', fontSize: 14 },

  registerHint: { textAlign: 'center', color: C.muted, fontSize: 13, marginTop: 8 },
  registerLink: { color: C.red, fontWeight: '700' },
});