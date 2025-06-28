import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';

const ORANGE = '#FFA500';
const BLACK = '#23272F';
const GREY = '#444B54';
const LIGHT_GREY = '#B0B6C3';

export default function ScanCompleteScreen() {
  const [freeSpace, setFreeSpace] = useState(null);
  const [totalSpace, setTotalSpace] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchStorage() {
      const free = await FileSystem.getFreeDiskStorageAsync();
      const total = await FileSystem.getTotalDiskCapacityAsync();
      setFreeSpace(free);
      setTotalSpace(total);
    }
    fetchStorage();
  }, []);

  let freeGB = freeSpace ? (freeSpace / (1024 ** 3)).toFixed(1) : '--';
  let usedPercent = (freeSpace && totalSpace) ? (100 - (freeSpace / totalSpace) * 100).toFixed(0) : '--';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>You're all set and ready to clean!</Text>
      <View style={styles.illustration}>
        {/* Placeholder for illustration */}
        <Text style={{color: ORANGE, fontSize: 80}}>🧹</Text>
      </View>
      <View style={styles.statsRow}>
        <View style={{alignItems: 'center', marginRight: 32}}>
          <Text style={styles.statsValue}>{freeGB} <Text style={{fontSize: 18}}>GB</Text></Text>
          <Text style={styles.statsLabel}>Free space</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={[styles.statsValue, {color: ORANGE}]}>{usedPercent} <Text style={{fontSize: 18}}>%</Text></Text>
          <Text style={styles.statsLabel}>Used space</Text>
        </View>
      </View>
      <Text style={styles.statsNote}>Values may differ slightly from system settings due to OS reporting.</Text>
      <View style={{height: 32}} />
      <View style={styles.checkRow}>
        <CheckMark />
        <Text style={styles.checkText}>Give us access</Text>
      </View>
      <View style={styles.checkRow}>
        <CheckMark />
        <Text style={styles.checkText}>Scan for junk</Text>
      </View>
      <View style={{flex: 1}} />
      <Pressable style={styles.resultsBtn} onPress={() => router.push('/clean-results')}>
        <Text style={styles.resultsBtnText}>SEE RESULTS</Text>
      </Pressable>
      <View style={{ height: 32 }} />
    </View>
  );
}

function CheckMark() {
  return (
    <View style={{width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center', marginRight: 12}}>
      <Text style={{color: ORANGE, fontSize: 22, fontWeight: 'bold'}}>✓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
    padding: 24,
    paddingTop: 48,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statsValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  statsLabel: {
    color: LIGHT_GREY,
    fontSize: 15,
    marginTop: 2,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginLeft: 8,
  },
  checkText: {
    color: LIGHT_GREY,
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },
  resultsBtn: {
    marginTop: 0,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    backgroundColor: ORANGE,
  },
  resultsBtnText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  statsNote: {
    color: LIGHT_GREY,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
}); 