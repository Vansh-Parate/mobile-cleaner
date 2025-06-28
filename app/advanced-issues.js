import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ORANGE = '#FFA500';
const BLACK = '#23272F';
const CARD_BG = '#292D36';
const LIGHT_GREY = '#B0B6C3';
const YELLOW = '#FFC107';

const issues = [
  {
    icon: <MaterialCommunityIcons name="eye-outline" size={28} color="#4FC3F7" />, // blue
    title: '11.3 GB remaining to be cleaned',
    desc: 'Enable Deep Clean to remove hidden junk files.',
    locked: true,
  },
  {
    icon: <Ionicons name="globe-outline" size={28} color="#4FC3F7" />, // blue
    title: 'Clean browser data',
    desc: 'Clean up records that are stored when you browse or search online.',
    locked: true,
  },
  {
    icon: <MaterialCommunityIcons name="snowflake" size={28} color="#4FC3F7" />, // blue
    title: 'Put 61 unused apps to sleep',
    desc: 'Prevent background activity and suspend notifications until you reopen those apps.',
    locked: true,
  },
];

export default function AdvancedIssuesScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </Pressable>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 14 }}>
          <View style={styles.warningCircle}>
            <Ionicons name="alert" size={28} color={YELLOW} />
          </View>
          <Text style={styles.issuesTitle}>3 advanced issues</Text>
          <Text style={styles.issuesSubtitle}>Resolve these issues with AVG Cleaner Premium</Text>
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Detailed results</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionDesc}>2 items</Text>
            <Ionicons name="chevron-forward" size={18} color={LIGHT_GREY} style={{ marginLeft: 2 }} />
          </View>
        </View>
        <View style={styles.sectionDivider} />
        {issues.map((item, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardIcon}>{item.icon}</View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
            {item.locked && <Ionicons name="lock-closed" size={20} color={ORANGE} style={{ marginLeft: 8 }} />}
          </View>
        ))}
      </ScrollView>
      <Pressable style={styles.resolveBtn} onPress={() => router.push('/dashboard')}>
        <Text style={styles.resolveBtnText}>RESOLVE ALL</Text>
      </Pressable>
      <Pressable style={styles.skipBtn} onPress={() => router.push('/dashboard')}>
        <Text style={styles.skipBtnText}>SKIP FOR NOW</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
    paddingTop: 36,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 0,
  },
  warningCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#23272F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  issuesTitle: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'center',
  },
  issuesSubtitle: {
    color: LIGHT_GREY,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 18,
    marginTop: 0,
    marginBottom: 0,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 18,
    marginRight: 18,
    marginBottom: 6,
  },
  sectionDesc: {
    color: LIGHT_GREY,
    fontSize: 13,
  },
  sectionDivider: {
    height: 1.5,
    backgroundColor: CARD_BG,
    marginVertical: 14,
    marginHorizontal: 10,
    borderRadius: 1,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardIcon: {
    marginRight: 14,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  cardDesc: {
    color: LIGHT_GREY,
    fontSize: 13,
    marginTop: 2,
  },
  resolveBtn: {
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 10,
  },
  resolveBtnText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  skipBtn: {
    alignItems: 'center',
    marginBottom: 24,
  },
  skipBtnText: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
}); 