import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/constants/api';
import { palette } from '@/constants/palette';
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
        if (active) {
          setProfile({
            ...payload,
            name: [payload.firstName, payload.lastName].filter(Boolean).join(' '),
          });
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Unable to load profile.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadProfile();
    return () => { active = false; };
  }, [token, logout]);

  const displayProfile = profile || user;

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.content}>
        <Text style={styles.title}>My profile</Text>
        <Text style={styles.subtitle}>Your personal account information.</Text>

        {loading ? (
          <View style={styles.message}>
            <ActivityIndicator color={palette.primary} />
            <Text style={styles.muted}>Loading profile...</Text>
          </View>
        ) : null}
        {error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text> : null}

        <View style={styles.card}>
          <Text style={styles.name}>{displayProfile?.name || 'Student account'}</Text>
          <Text style={styles.role}>{displayProfile?.role || 'Student'}</Text>
          <View style={styles.divider} />
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{displayProfile?.email || 'Not available'}</Text>
          <Text style={styles.label}>Session</Text>
          <Text style={styles.value}>{token ? 'Signed in' : 'Not signed in'}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
          onPress={() => void logout()}
        >
          <Text style={styles.logoutText}>Sign out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: palette.background,
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    gap: 12,
  },
  title: {
    color: palette.ink,
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.muted,
    fontSize: 13,
    marginBottom: 8,
  },
  message: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: palette.surface,
    borderRadius: 8,
  },
  muted: {
    color: palette.muted,
    fontSize: 13,
  },
  error: {
    color: palette.danger,
    fontSize: 13,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 10,
    padding: 18,
    gap: 8,
  },
  name: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  role: {
    color: palette.primary,
    fontSize: 13,
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: palette.line,
    marginVertical: 6,
  },
  label: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 4,
  },
  value: {
    color: palette.ink,
    fontSize: 14,
  },
  logout: {
    alignItems: 'center',
    padding: 13,
    backgroundColor: palette.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
  },
  logoutText: {
    color: palette.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
