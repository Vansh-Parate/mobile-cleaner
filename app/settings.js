import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BG = '#23272F';
const WHITE = '#fff';
const GREY = '#B0B6C3';
const ITEM_BG = 'transparent';
const ARROW_COLOR = '#B0B6C3';

const menuItems = [
  { label: 'Quick Clean' },
  { label: 'Analysis preferences' },
  { label: 'Notifications' },
  { label: 'Real-time Detection' },
  { label: 'Cloud services' },
  { label: 'Personal privacy' },
  { label: 'Language', subtitle: 'Some languages require additional download. It may take some time.' },
];

export default function Settings() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, paddingTop: 48 }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={16} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={26} color={WHITE} />
          </Pressable>
          <Text style={[styles.header, { fontSize: 20 }]}>Settings</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, idx) => (
            <Pressable
              key={item.label}
              style={[styles.item, idx === menuItems.length - 1 && { marginBottom: 0 }]}
              onPress={() => {
                if (item.label === 'Quick Clean') router.push('/quick-clean-settings');
                else if (item.label === 'Real-time Detection') router.push('/real-time-detection');
                else if (item.label === 'Notifications') router.push('/notifications');
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                {item.subtitle && <Text style={styles.itemSubtitle}>{item.subtitle}</Text>}
              </View>
              <Ionicons name="chevron-forward" size={22} color={ARROW_COLOR} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 8,
    marginBottom: 0,
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
    borderRadius: 20,
  },
  header: {
    color: WHITE,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ITEM_BG,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: '#353A43',
    minHeight: 44,
  },
  itemLabel: {
    color: WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    color: GREY,
    fontSize: 14,
    marginTop: 4,
    fontWeight: 'normal',
    maxWidth: 320,
  },
}); 