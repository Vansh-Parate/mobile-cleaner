import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';

const ORANGE = '#FFA500';
const BLACK = '#23272F';
const CARD_BG = '#292D36';
const LIGHT_GREY = '#B0B6C3';
const BLUE = '#4FC3F7';
const PURPLE = '#A259FF';
const YELLOW = '#FFD600';

export default function Dashboard() {
  const [freeSpace, setFreeSpace] = useState(null);
  const [totalSpace, setTotalSpace] = useState(null);
  const [mediaStats, setMediaStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [free, total, media] = await Promise.all([
          FileSystem.getFreeDiskStorageAsync(),
          FileSystem.getTotalDiskCapacityAsync(),
          MediaLibrary.getAssetsAsync({ first: 1000000 })
        ]);
        setFreeSpace(free);
        setTotalSpace(total);
        setMediaStats(media);
      } catch (e) {
        setFreeSpace(null);
        setTotalSpace(null);
        setMediaStats(null);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  let freeGB = freeSpace ? (freeSpace / (1024 ** 3)).toFixed(1) : '--';
  let totalGB = totalSpace ? (totalSpace / (1024 ** 3)).toFixed(1) : '--';
  let usedPercent = (freeSpace && totalSpace) ? (100 - (freeSpace / totalSpace) * 100).toFixed(0) : '--';
  let mediaCount = mediaStats?.totalCount || 0;
  // Simulate file sizes for legend (replace with real logic if available)
  let unneededMB = (mediaCount * 0.05).toFixed(1); // fake: 50KB per file
  let hiddenGB = (totalSpace ? (totalSpace * 0.03) / (1024 ** 3) : 0).toFixed(1); // fake: 3% of total
  let reviewGB = (mediaCount * 0.002).toFixed(1); // fake: 2MB per file

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable>
          <Ionicons name="menu" size={28} color="#fff" />
        </Pressable>
        <Text style={styles.header}>AVG Cleaner</Text>
        <Pressable style={styles.upgradeBtn}>
          <Text style={styles.upgradeBtnText}>UPGRADE</Text>
        </Pressable>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Storage Card */}
        <View style={styles.storageCard}>
          <Text style={styles.storageLabel}>Free space</Text>
          {loading ? (
            <ActivityIndicator color={ORANGE} style={{ marginVertical: 24 }} />
          ) : (
            <>
              <Text style={styles.storageValue}>{freeGB} <Text style={{ fontSize: 14, color: '#fff' }}>GB</Text></Text>
              <Text style={styles.storageSub}>Free up to <Text style={{ fontWeight: 'bold', color: '#fff' }}>{totalGB} GB</Text></Text>
              <View style={styles.barRow}>
                <View style={[styles.barSeg, { backgroundColor: BLUE, flex: 0.15 }]} />
                <View style={[styles.barSeg, { backgroundColor: ORANGE, flex: 0.25 }]} />
                <View style={[styles.barSeg, { backgroundColor: PURPLE, flex: 0.6 }]} />
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: BLUE }]} /><Text style={styles.legendText}>Unneeded files</Text></View>
                <Text style={styles.legendValue}>{unneededMB} MB</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: ORANGE }]} /><Text style={styles.legendText}>Hidden caches</Text></View>
                <Text style={styles.legendValue}>{hiddenGB} GB</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: PURPLE }]} /><Text style={styles.legendText}>Files to review</Text></View>
                <Text style={styles.legendValue}>{reviewGB} GB</Text>
              </View>
              <Pressable style={styles.quickCleanBtn}>
                <Text style={styles.quickCleanBtnText}>QUICK CLEAN</Text>
              </Pressable>
            </>
          )}
        </View>
        {/* Feature Grid */}
        <View style={styles.gridRow}>
          <View style={styles.gridCard}>
            <MaterialCommunityIcons name="speedometer" size={28} color={LIGHT_GREY} />
            <Text style={styles.gridTitle}>Sleep Mode</Text>
          </View>
          <View style={styles.gridCard}>
            <Ionicons name="bulb-outline" size={28} color={LIGHT_GREY} />
            <Text style={styles.gridTitle}>Tips</Text>
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.gridCard}>
            <Ionicons name="images-outline" size={28} color={LIGHT_GREY} />
            <Text style={styles.gridTitle}>Media</Text>
            <Text style={styles.gridValue}>+ {mediaCount} files</Text>
          </View>
          <View style={styles.gridCard}>
            <Ionicons name="apps-outline" size={28} color={LIGHT_GREY} />
            <Text style={styles.gridTitle}>Apps</Text>
            <Text style={styles.gridValue}>+ 43.2 GB</Text>
          </View>
        </View>
        {/* Customize Section */}
        <View style={styles.customizeRow}>
          <Ionicons name="lock-closed" size={20} color={ORANGE} style={{ marginRight: 8 }} />
          <Text style={styles.customizeText}>Customize</Text>
        </View>
        <View style={styles.illustrationCard}>
          <MaterialCommunityIcons name="shield-check-outline" size={80} color={PURPLE} style={{ marginTop: 16 }} />
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  header: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  upgradeBtn: {
    backgroundColor: YELLOW,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 7,
    shadowColor: YELLOW,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  upgradeBtnText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1.2,
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  storageCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    marginHorizontal: 10,
    marginBottom: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#353A43',
  },
  storageLabel: {
    color: LIGHT_GREY,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 6,
  },
  storageValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  storageSub: {
    color: LIGHT_GREY,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 18,
  },
  barRow: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 18,
    backgroundColor: '#23272F',
  },
  barSeg: {
    height: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 1,
    marginTop: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    color: LIGHT_GREY,
    fontSize: 11,
  },
  legendValue: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  quickCleanBtn: {
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 22,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 0,
  },
  quickCleanBtnText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
  gridRow: {
    flexDirection: 'row',
    marginHorizontal: 6,
    marginBottom: 8,
  },
  gridCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    margin: 4,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 2,
  },
  gridTitle: {
    color: LIGHT_GREY,
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
  gridValue: {
    color: '#fff',
    fontSize: 11,
    marginTop: 2,
  },
  customizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  customizeText: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  illustrationCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    marginHorizontal: 10,
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 18,
  },
}); 