import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import StudentCard, { type Student } from '@/components/StudentCard';
import { API_BASE_URL } from '@/constants/api';
import { palette } from '@/constants/palette';
import { useAuth } from '@/hooks/useAuth';

export default function StudentsScreen() {
  const { token, logout } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const payload = await response.json();
      if (response.status === 401) {
        await logout();
        throw new Error('Your session expired. Please sign in again.');
      }
      if (!response.ok) throw new Error(payload.message || 'Unable to load students.');
      if (!Array.isArray(payload.users)) throw new Error('The API returned an invalid user list.');
      setStudents(payload.users.map((person: { firstName?: string; lastName?: string; company?: { department?: string } }) => ({
        ...person,
        name: [person.firstName, person.lastName].filter(Boolean).join(' '),
        course: person.company?.department,
      })));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load students.');
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  const filteredStudents = students.filter((student) =>
    (student.name || '').toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Students</Text>
      <Text style={styles.subtitle}>Find a student and view their details.</Text>

      <TextInput
        style={styles.search}
        accessibilityLabel="Search students"
        placeholder="Search by name"
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
      />

      {loading ? (
        <View style={styles.message}>
          <ActivityIndicator color={palette.primary} />
          <Text style={styles.messageText}>Loading students...</Text>
        </View>
      ) : error ? (
        <View style={styles.message}>
          <Text style={styles.error}>{error}</Text>
          <Pressable accessibilityRole="button" style={styles.retry} onPress={() => void loadStudents()}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item, index) => String(item.id ?? index)}
          renderItem={({ item }) => <StudentCard student={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.messageText}>No students found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: palette.background,
    padding: 20,
  },
  title: {
    color: palette.ink,
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.muted,
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  search: {
    height: 44,
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  list: {
    gap: 10,
    paddingBottom: 20,
  },
  message: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
    backgroundColor: palette.surface,
    borderRadius: 10,
  },
  messageText: {
    color: palette.muted,
    fontSize: 14,
    textAlign: 'center',
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
});
