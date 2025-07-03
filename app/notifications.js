import { View, Text, StyleSheet, Pressable, SafeAreaView, Switch, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const BG = '#23272F';
const WHITE = '#fff';
const GREY = '#B0B6C3';
const GREEN = '#2ED47A';
const BLUE = '#4FC3F7';
const CARD_BG = '#23272F';

const notificationCategories = [
  { icon: <MaterialCommunityIcons name="broom" size={24} color={WHITE} />, label: 'Junk Cleaning', enabled: 2, total: 2 },
  { icon: <FontAwesome5 name="th-large" size={20} color={WHITE} />, label: 'Applications', enabled: 7, total: 7 },
  { icon: <Ionicons name="images-outline" size={22} color={WHITE} />, label: 'Photos', enabled: 5, total: 5 },
  { icon: <Ionicons name="document-text-outline" size={22} color={WHITE} />, label: 'Other files', enabled: 4, total: 4 },
];

const faqs = [
  { q: 'How do notifications work?', a: 'Notifications are sent based on your selected preferences.' },
  { q: "How do you know what's relevant?", a: 'We analyze your device activity to determine relevant notifications.' },
  { q: 'Is this only for subscribers?', a: 'Some features may be limited to subscribers.' },
];

export default function Notifications() {
  const [enabled, setEnabled] = useState(true);
  const [faqOpen, setFaqOpen] = useState([false, false, false]);
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, paddingTop: 48 }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={16} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={26} color={WHITE} />
          </Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.toggleBar}>
            <Text style={styles.toggleBarText}>Notifications and Reports</Text>
            <View style={styles.switchBg}>
              <Switch
                value={enabled}
                onValueChange={setEnabled}
                trackColor={{ false: '#444B54', true: GREEN }}
                thumbColor={enabled ? '#111' : '#fff'}
                style={styles.switch}
              />
            </View>
          </View>
          <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
          <Text style={styles.sectionDesc}>Select the items for which you want to receive notifications.</Text>
          {notificationCategories.map((cat, i) => (
            <Pressable key={cat.label} style={styles.catRow}>
              <View style={styles.catIconWrap}>{cat.icon}</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.catLabel}>{cat.label}</Text>
                <Text style={styles.catCount}><Text style={{ color: GREEN }}>{cat.enabled}</Text> / {cat.total} notifications enabled</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={GREY} />
            </Pressable>
          ))}
          <Pressable style={styles.freqRow}>
            <Text style={styles.freqLabel}>Frequency</Text>
            <Ionicons name="lock-closed" size={18} color={GREY} style={{ marginLeft: 6 }} />
          </Pressable>
          <Text style={styles.freqDesc}>Choose how often you want to receive notifications.</Text>
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionLabel}>REPORTS</Text>
          <Text style={styles.sectionDesc}>Select the day of the week on which to receive your weekly reports.</Text>
          <View style={styles.reportRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reportLabel}>New installs</Text>
              <Text style={styles.reportDesc}>An up-to-date report of newly installed applications. Delivered once a week.</Text>
            </View>
            <Text style={styles.reportDay}>Friday</Text>
          </View>
          <Text style={styles.sectionDivider} />
          <Text style={styles.sectionLabel}>ABOUT NOTIFICATIONS</Text>
          {faqs.map((faq, i) => (
            <View key={faq.q} style={styles.faqWrap}>
              <Pressable style={styles.faqRow} onPress={() => setFaqOpen(faqOpen.map((v, idx) => idx === i ? !v : v))}>
                <View style={styles.faqIconWrap}><Ionicons name="help-circle-outline" size={22} color={WHITE} /></View>
                <Text style={styles.faqQ}>{faq.q}</Text>
                <Ionicons name={faqOpen[i] ? 'chevron-up' : 'chevron-down'} size={20} color={GREY} />
              </Pressable>
              {faqOpen[i] && <Text style={styles.faqA}>{faq.a}</Text>}
            </View>
          ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: 0, paddingHorizontal: 8, marginBottom: 0 },
  backBtn: { padding: 4, marginRight: 8, borderRadius: 20 },
  toggleBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: GREEN, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 18, marginHorizontal: 12, marginBottom: 18, marginTop: 0, justifyContent: 'space-between' },
  toggleBarText: { color: '#111', fontWeight: 'bold', fontSize: 20 },
  sectionLabel: { color: GREY, fontSize: 13, fontWeight: 'bold', marginTop: 18, marginBottom: 4, marginLeft: 18, letterSpacing: 1 },
  sectionDesc: { color: GREY, fontSize: 15, marginLeft: 18, marginBottom: 16, marginTop: 0 },
  catRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: CARD_BG, borderRadius: 16, padding: 16, marginHorizontal: 12, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  catIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  catLabel: { color: WHITE, fontWeight: 'bold', fontSize: 17, marginBottom: 2 },
  catCount: { color: GREY, fontSize: 14 },
  freqRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 18, marginTop: 2 },
  freqLabel: { color: WHITE, fontWeight: 'bold', fontSize: 16 },
  freqDesc: { color: GREY, fontSize: 14, marginLeft: 18, marginBottom: 8, marginTop: 0 },
  sectionDivider: { height: 1.5, backgroundColor: '#353A43', marginVertical: 18, marginHorizontal: 10, borderRadius: 1 },
  reportRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 18, marginRight: 18, marginBottom: 8 },
  reportLabel: { color: WHITE, fontWeight: 'bold', fontSize: 16 },
  reportDesc: { color: GREY, fontSize: 14 },
  reportDay: { color: GREEN, fontWeight: 'bold', fontSize: 15, marginLeft: 12 },
  faqWrap: { marginHorizontal: 12, marginBottom: 8, backgroundColor: CARD_BG, borderRadius: 14 },
  faqRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  faqIconWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  faqQ: { color: WHITE, fontWeight: 'bold', fontSize: 15, flex: 1 },
  faqA: { color: GREY, fontSize: 14, marginLeft: 18, marginRight: 18, marginBottom: 12 },
  switchBg: {
    backgroundColor: '#181B20', // slightly lighter black for contrast
    borderRadius: 16,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 52,
    minHeight: 32,
    marginLeft: 8,
  },
  switch: {
    alignSelf: 'center',
  },
}); 