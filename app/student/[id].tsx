import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { type Student } from '@/components/StudentCard';
import { API_BASE_URL } from '@/constants/api';
import { palette } from '@/constants/palette';
import { useAuth } from '@/hooks/useAuth';

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { token, logout } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStudent = useCallback(async () => {
    if (!id || !/^\d+$/.test(id)) {
      setStudent(null);
      setError('Invalid student ID.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(id)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const payload = await response.json();
      if (response.status === 401) {
        await logout();
        throw new Error('Your session has expired. Please sign in again.');
      }
      if (response.status === 404) throw new Error('Student not found.');
      if (!response.ok) throw new Error(payload.message || 'Unable to load student details.');
      setStudent({
        ...payload,
        name: [payload.firstName, payload.lastName].filter(Boolean).join(' '),
        course: payload.company?.department,
      });
    } catch (cause) {
      setStudent(null);
      setError(cause instanceof Error ? cause.message : 'Unable to load student details.');
    } finally {
      setLoading(false);
    }
  }, [id, token, logout]);

  useEffect(() => {
    void loadStudent();
  }, [loadStudent]);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.content}>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Student directory</Text>
        </Pressable>

        <Text style={styles.title}>Student details</Text>
        <Text style={styles.subtitle}>Student ID: {id || '—'}</Text>

        {loading ? (
          <View style={styles.message}>
            <ActivityIndicator color={palette.primary} />
            <Text style={styles.messageText}>Loading student...</Text>
          </View>
        ) : error ? (
          <View style={styles.message} accessibilityLiveRegion="polite">
            <Text style={styles.error}>{error}</Text>
            <Pressable accessibilityRole="button" style={styles.retry} onPress={() => void loadStudent()}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : student ? (
          <View style={styles.card}>
            <Text style={styles.name}>{student.name || 'Name not available'}</Text>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{student.email || 'Not available'}</Text>
            <Text style={styles.label}>Department</Text>
            <Text style={styles.value}>{student.course || 'Not available'}</Text>
            <Text style={styles.label}>Student ID</Text>
            <Text style={styles.value}>{String(student.id || id)}</Text>
          </View>
        ) : null}

        <Text style={styles.note}>Student records are sample data from the demo API.</Text>
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
  back: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  backText: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
  title: {
    color: palette.ink,
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.muted,
    fontSize: 13,
    marginBottom: 6,
  },
  message: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 150,
    padding: 20,
    backgroundColor: palette.surface,
    borderRadius: 10,
  },
  messageText: {
    color: palette.muted,
    fontSize: 14,
  },
  error: {
    color: palette.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  retry: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 7,
  },
  retryText: {
    color: palette.surface,
    fontWeight: '600',
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
    marginBottom: 4,
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
  note: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 4,
  },
});
