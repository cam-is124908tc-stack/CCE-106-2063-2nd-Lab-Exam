import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { palette } from '@/constants/palette';

export default function DashboardScreen() {
  const { token, user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.content}>
        <Text style={styles.schoolName}>CCE 106 · Student Services</Text>

        <View style={styles.welcome}>
          <Text style={styles.title}>Welcome, {firstName}</Text>
          <Text style={styles.subtitle}>Your student services in one place.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick actions</Text>

          <Link href="/(app)/students" asChild>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}
            >
              <Text style={styles.actionTitle}>Student directory</Text>
              <Text style={styles.actionDescription}>Browse student records</Text>
            </Pressable>
          </Link>

          <Link href="/(app)/profile" asChild>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}
            >
              <Text style={styles.actionTitle}>My profile</Text>
              <Text style={styles.actionDescription}>View your account details</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.session}>
          <Text style={styles.sectionTitle}>Session status</Text>
          <Text style={styles.subtitle}>
            {token ? 'Authenticated' : 'No active session'}
          </Text>
        </View>
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
    maxWidth: 820,
    alignSelf: 'center',
    gap: 20,
  },
  schoolName: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  welcome: {
    gap: 6,
    marginTop: 4,
  },
  title: {
    color: palette.ink,
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
  },
  section: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  action: {
    backgroundColor: palette.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  actionTitle: {
    color: palette.surface,
    fontSize: 15,
    fontWeight: '600',
  },
  actionDescription: {
    color: palette.surface,
    fontSize: 12,
  },
  pressed: {
    opacity: 0.8,
  },
  session: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
});
