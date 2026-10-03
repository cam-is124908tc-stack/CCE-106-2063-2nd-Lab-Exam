import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { palette } from '@/constants/palette';

export type Student = {
  id?: string | number;
  name?: string | null;
  email?: string | null;
  course?: string | null;
  image?: string | null;
};

export default function StudentCard({ student }: { student: Student }) {
  const router = useRouter();

  const handleViewDetails = () => {
    if (student.id === undefined || student.id === null || student.id === '') return;
    router.push({ pathname: '/student/[id]', params: { id: String(student.id) } });
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handleViewDetails}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{student.name || 'Name not available'}</Text>
        <Text style={styles.email} numberOfLines={1}>{student.email || 'Email not available'}</Text>
        {student.course ? <Text style={styles.course}>{student.course}</Text> : null}
      </View>
      <Text style={styles.link}>View</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.75,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: '600',
  },
  email: {
    color: palette.muted,
    fontSize: 12,
  },
  course: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 2,
  },
  link: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
