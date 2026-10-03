import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/constants/api';
import type { User } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const payload = await response.json();
        if (response.status === 401) {
          await logout();
          throw new Error('Your session expired. Please sign in again.');
        }
        if (!response.ok) throw new Error(payload.message || 'Unable to load profile.');
        if (active) setProfile({
          ...payload,
          name: [payload.firstName, payload.lastName].filter(Boolean).join(' '),
        });
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Unable to load profile.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadProfile();
    return () => { active = false; };
  }, [token, logout]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MY PROFILE</Text>
      {loading ? <View style={styles.state}><ActivityIndicator color="#245bb2" /><Text style={styles.note}>Loading profile…</Text></View> : null}
      {error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text> : null}
      <View style={styles.card}>
        <Text style={styles.text}>Name: {profile?.name || user?.name || '—'}</Text>
        <Text style={styles.text}>Email: {profile?.email || user?.email || '—'}</Text>
        <Text style={styles.text}>Role: {profile?.role || user?.role || '—'}</Text>
        {!profile && !user && <Text style={styles.note}>No profile loaded yet.</Text>}
      </View>
      <Text style={styles.text}>Session Status: {token ? 'Authenticated' : 'Not Available'}</Text>
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => void logout()}><Text style={styles.buttonText}>LOGOUT</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 20, backgroundColor: '#f2f5fa' },
  title: { color: '#17324d', fontSize: 24, fontWeight: '700' },
  state: { alignItems: 'center', gap: 8 },
  card: { backgroundColor: '#ffffff', padding: 20, gap: 16, borderRadius: 12 },
  text: { color: '#536579', fontSize: 16 },
  note: { color: '#536579', fontSize: 12 },
  error: { color: '#b42318' },
  button: { backgroundColor: '#245bb2', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '700' },
});
