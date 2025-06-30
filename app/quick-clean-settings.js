import { View, Text, StyleSheet, ScrollView, Switch, Pressable, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ORANGE = '#FFA500';
const BLACK = '#23272F';
const GREY = '#444B54';
const CARD_BG = '#292D36';
const LIGHT_GREY = '#B0B6C3';

const unneededCategories = [
  { key: 'hidden', label: 'Hidden caches', desc: 'Temporary files that are deep in your app settings and more difficult to remove.', locked: true },
  { key: 'visible', label: 'Visible caches', desc: 'Temporary files that can be recreated.' },
  { key: 'browser', label: 'Browser data', desc: 'Saved data collected by your browsers when you browse or search online.', locked: true },
  { key: 'residual', label: 'Residual files', desc: 'Leftover files after you uninstall apps from your device.' },
  { key: 'apks', label: 'Installed APKs', desc: 'Leftover installation files after new apps are installed.' },
  { key: 'ad', label: 'Ad caches', desc: 'Temporary files that make ads work.' },
  { key: 'thumbs', label: 'Thumbnails', desc: 'Small preview versions of your photos.' },
  { key: 'empty', label: 'Empty folders', desc: 'Folders with nothing inside.' },
];

const reviewCategories = [
  { key: 'trash', label: 'Trash', desc: 'Files that you already moved to the Trash folder.' },
  { key: 'appdata', label: 'App data', desc: "Content that's created or downloaded while you use your apps (like game progress or downloaded music)." },
  { key: 'downloads', label: 'Downloads', desc: 'Files that you downloaded from the internet.' },
  { key: 'screenshots', label: 'Screenshots', desc: 'Photos that show what\'s visible on your device display at the moment they\'re taken.' },
  { key: 'badphotos', label: 'Bad photos', desc: 'Photos from your camera that we detected as blurry, dark, or low quality.' },
  { key: 'largeold', label: 'Large old files', desc: 'Files that are at least 100 MB and were created at least one month ago.' },
  { key: 'temp', label: 'Temporary files', desc: 'Includes log files, junk files imported from other systems, and other temporary data.' },
  { key: 'empty', label: 'Empty folders', desc: 'Folders with nothing inside.' },
];

export default function QuickCleanSettings() {
  const [toggles, setToggles] = useState({
    visible: true,
    residual: true,
    apks: true,
    ad: true,
    thumbs: true,
    empty: true,
    trash: true,
    appdata: true,
    downloads: true,
    screenshots: false,
    badphotos: false,
    largeold: true,
    temp: false,
  });
  const router = useRouter();

  const handleToggle = (key) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, paddingTop: 32 }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </Pressable>
          <Text style={styles.header}>Quick Clean settings</Text>
          <View style={{ width: 28 }} />
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.sectionTitle}>UNNEEDED FILES</Text>
          <Text style={styles.sectionDesc}>These items don't impact how your device works. You can safely delete them and you won't notice they're gone. You can still review these files before deleting.</Text>
          {unneededCategories.map((item) => (
            <View key={item.key} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
              {item.locked ? (
                <Ionicons name="lock-closed" size={22} color={ORANGE} />
              ) : (
                <Switch
                  value={!!toggles[item.key]}
                  onValueChange={() => handleToggle(item.key)}
                  trackColor={{ false: GREY, true: ORANGE }}
                  thumbColor={toggles[item.key] ? ORANGE : GREY}
                />
              )}
            </View>
          ))}
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionTitle}>FILES TO REVIEW</Text>
          <Text style={styles.sectionDesc}>These items may be valuable to you, so you might notice if they're gone. We recommend reviewing these files before deleting.</Text>
          {reviewCategories.map((item) => (
            <View key={item.key} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
              {item.locked ? (
                <Ionicons name="lock-closed" size={22} color={ORANGE} />
              ) : (
                <Switch
                  value={!!toggles[item.key]}
                  onValueChange={() => handleToggle(item.key)}
                  trackColor={{ false: GREY, true: ORANGE }}
                  thumbColor={toggles[item.key] ? ORANGE : GREY}
                />
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
    paddingTop: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 4,
    marginLeft: 18,
    letterSpacing: 1,
  },
  sectionDesc: {
    color: LIGHT_GREY,
    fontSize: 15,
    marginLeft: 18,
    marginBottom: 16,
    marginTop: 0,
  },
  sectionDivider: {
    height: 1.5,
    backgroundColor: CARD_BG,
    marginVertical: 18,
    marginHorizontal: 10,
    borderRadius: 1,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 2,
  },
  cardDesc: {
    color: LIGHT_GREY,
    fontSize: 15,
    marginTop: 2,
  },
}); 