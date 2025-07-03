import { View, Text, StyleSheet, Switch, Pressable, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const BG = '#23272F';
const WHITE = '#fff';
const GREY = '#B0B6C3';

export default function RealTimeDetection() {
  const [leftovers, setLeftovers] = useState(true);
  const [battery, setBattery] = useState(false);
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, paddingTop: 48 }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={16} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={26} color={WHITE} />
          </Pressable>
          <Text style={styles.header}>Real-time Detection</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>App leftovers</Text>
              <Text style={styles.desc}>Let me know if there's unimportant data left behind after uninstalling an app.</Text>
            </View>
            <Switch
              value={leftovers}
              onValueChange={setLeftovers}
              trackColor={{ false: GREY, true: '#4FC36E' }}
              thumbColor={leftovers ? '#4FC36E' : GREY}
            />
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Battery monitoring</Text>
              <Text style={styles.desc}>Measure how I use my battery so I can see insights about how to save power.</Text>
            </View>
            <Switch
              value={battery}
              onValueChange={setBattery}
              trackColor={{ false: GREY, true: '#4FC36E' }}
              thumbColor={battery ? '#4FC36E' : GREY}
            />
          </View>
        </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  desc: {
    color: GREY,
    fontSize: 15,
    marginBottom: 0,
  },
}); 