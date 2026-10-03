/* eslint-disable @typescript-eslint/no-unused-vars -- State setters and loader are exam placeholders. */
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { type Student } from '@/components/StudentCard';
import { API_BASE_URL } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStudent = async () => {
    if (!id || !/^\d+$/.test(id)) {
      setStudent(null);
      setError('Invalid student ID.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/students/${encodeURIComponent(id)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const payload = await response.json();
      if (response.status === 401) throw new Error('Your session has expired. Please sign in again.');
      if (response.status === 404) throw new Error('Student not found.');
      if (!response.ok) throw new Error(payload.message || 'Unable to load student details.');
      setStudent(payload);
    } catch (cause) {
      setStudent(null);
      setError(cause instanceof Error ? cause.message : 'Unable to load student details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStudent();
  }, [id, token]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Student Details</Text>
      {loading ? <View style={styles.state}><ActivityIndicator color="#245bb2" /><Text style={styles.text}>Loading student…</Text></View>
        : error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>
        : !student ? <Text style={styles.text}>No student record available.</Text> : null}
      <View style={styles.card}>
        <Text style={styles.text}>ID: {id || 'Not available'}</Text>
        <Text style={styles.text}>Name: {student?.name || '—'}</Text>
        <Text style={styles.text}>Email: {student?.email || '—'}</Text>
        <Text style={styles.text}>Course: {student?.course || '—'}</Text>
      </View>
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => router.back()}><Text style={styles.buttonText}>Back</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 20, backgroundColor: '#f2f5fa' },
  title: { color: '#17324d', fontSize: 28, fontWeight: '700' },
  state: { gap: 12, alignItems: 'center' },
  card: { backgroundColor: '#ffffff', padding: 20, gap: 16, borderRadius: 12 },
  text: { color: '#536579', fontSize: 16 },
  error: { color: '#b42318' },
  button: { backgroundColor: '#245bb2', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
