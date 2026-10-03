import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_BASE_URL } from '@/constants/api';
import { palette } from '@/constants/palette';
import { useAuth } from '@/hooks/useAuth';

export default function SignInScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setError('Enter your username and password.');
      return;
    }

    setLoading(true);
    setError('');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password }),
        signal: controller.signal,
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Unable to sign in.');
      if (typeof payload.accessToken !== 'string' || !payload.id) {
        throw new Error('The API returned an invalid login response.');
      }
      await login(payload.accessToken, {
        id: payload.id,
        name: [payload.firstName, payload.lastName].filter(Boolean).join(' '),
        email: payload.email,
        role: payload.role,
      });
      setPassword('');
    } catch (cause) {
      setError(cause instanceof Error && cause.name === 'AbortError'
        ? 'Login timed out. Check your connection and try again.'
        : cause instanceof Error ? cause.message : 'Unable to sign in.');
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.school}>CCE 106 · Student Services</Text>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Sign in to access student services.</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          accessibilityLabel="Username"
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username"
          returnKeyType="next"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          accessibilityLabel="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="current-password"
          returnKeyType="go"
          onSubmitEditing={() => void handleLogin()}
        />

        {error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text> : null}

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={() => void handleLogin()}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={palette.surface} /> : <Text style={styles.buttonText}>Login</Text>}
        </Pressable>

        <Text style={styles.demo}>Demo credentials: emilys / emilyspass</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: palette.background,
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 22,
    gap: 10,
  },
  school: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: palette.ink,
    fontSize: 26,
    fontWeight: '700',
    marginTop: 6,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 13,
    marginBottom: 12,
  },
  label: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
    backgroundColor: palette.background,
    color: palette.ink,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  error: {
    color: palette.danger,
    fontSize: 13,
  },
  button: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primary,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: palette.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
  demo: {
    color: palette.muted,
    fontSize: 11,
    marginTop: 4,
  },
});
