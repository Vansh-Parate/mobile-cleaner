import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Modal, TouchableWithoutFeedback, Image, Animated, Easing, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';

const ORANGE = '#FFA500';
const BLACK = '#23272F';
const CARD_BG = '#292D36';
const LIGHT_GREY = '#B0B6C3';
const BLUE = '#4FC3F7';
const PURPLE = '#A259FF';
const YELLOW = '#FFD600';

const storageIcons = {
  Apps: <FontAwesome5 name="th-large" size={22} color={LIGHT_GREY} style={{ marginRight: 12 }} />,
  Photos: <Ionicons name="images-outline" size={22} color={LIGHT_GREY} style={{ marginRight: 12 }} />,
  Audio: <Feather name="music" size={22} color={LIGHT_GREY} style={{ marginRight: 12 }} />,
  Videos: <Ionicons name="videocam-outline" size={22} color={LIGHT_GREY} style={{ marginRight: 12 }} />,
  'Other files': <Feather name="file" size={22} color={LIGHT_GREY} style={{ marginRight: 12 }} />,
};

export default function Dashboard() {
  const [freeSpace, setFreeSpace] = useState(null);
  const [totalSpace, setTotalSpace] = useState(null);
  const [mediaStats, setMediaStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-320)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  // Simulated storage breakdown (replace with real logic if needed)
  const [storageBreakdown, setStorageBreakdown] = useState({
    Apps: 43.2,
    Photos: 5.14,
    Audio: 1.59,
    Videos: 10.4,
    'Other files': 5.57,
  });
  const router = useRouter();

  const menuItems = [
    { icon: <FontAwesome5 name="th-large" size={20} color={LIGHT_GREY} />, label: 'Photo Optimizer' },
    { icon: <Feather name="cloud" size={20} color={LIGHT_GREY} />, label: 'Cloud Transfers' },
    { icon: <Ionicons name="phone-portrait-outline" size={20} color={LIGHT_GREY} />, label: 'System Info' },
    { icon: <MaterialCommunityIcons name="medal-outline" size={20} color={LIGHT_GREY} />, label: 'My subscription' },
    { icon: <Feather name="settings" size={20} color={LIGHT_GREY} />, label: 'Settings' },
    { icon: <Feather name="aperture" size={20} color={LIGHT_GREY} />, label: 'Themes' },
    { icon: <Ionicons name="help-circle-outline" size={20} color={LIGHT_GREY} />, label: 'Help & Feedback' },
    { icon: <Feather name="info" size={20} color={LIGHT_GREY} />, label: 'About this app' },
  ];

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // Request permissions for MediaLibrary
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          setFreeSpace(null);
          setTotalSpace(null);
          setMediaStats(null);
          setLoading(false);
          return;
        }
        const [free, total, media] = await Promise.all([
          FileSystem.getFreeDiskStorageAsync(),
          FileSystem.getTotalDiskCapacityAsync(),
          MediaLibrary.getAssetsAsync({ first: 1000000 })
        ]);
        if (!free || !total || !media || media.totalCount === 0) {
          // This is a placeholder for the removed errorMsg
        }
        setFreeSpace(free);
        setTotalSpace(total);
        setMediaStats(media);
      } catch (e) {
        // This is a placeholder for the removed errorMsg
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      Animated.parallel([
        Animated.timing(drawerAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(drawerAnim, {
          toValue: -320,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [drawerOpen]);

  let freeGB = freeSpace ? (freeSpace / (1024 ** 3)).toFixed(1) : '--';
  let totalGB = totalSpace ? (totalSpace / (1024 ** 3)).toFixed(1) : '--';
  let usedPercent = (freeSpace && totalSpace) ? (100 - (freeSpace / totalSpace) * 100).toFixed(0) : '--';
  let mediaCount = mediaStats?.totalCount || 0;
  // Simulate file sizes for legend (replace with real logic if available)
  let unneededMB = (mediaCount * 0.05).toFixed(1); // fake: 50KB per file
  let hiddenGB = (totalSpace ? (totalSpace * 0.03) / (1024 ** 3) : 0).toFixed(1); // fake: 3% of total
  let reviewGB = (mediaCount * 0.002).toFixed(1); // fake: 2MB per file

  return (
    <SafeAreaView style={styles.container}>
      {/* Drawer Overlay & Drawer - OUTSIDE the padded main content */}
      <Modal visible={drawerOpen} transparent animationType="none" onRequestClose={() => setDrawerOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setDrawerOpen(false)}>
          <Animated.View style={[styles.drawerOverlay, { opacity: overlayAnim }]} />
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}> 
          <ScrollView contentContainerStyle={styles.drawerScrollContent} showsVerticalScrollIndicator={false}>
            {/* Premium Card */}
            <View style={styles.drawerHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
                <Image source={{ uri: 'https://placehold.co/48x48?text=Cleaner' }} style={styles.drawerLogo} />
                <Text style={styles.drawerLogoText}>Cleaner</Text>
              </View>
              <View style={styles.premiumRow}>
                <Ionicons name="lock-closed" size={24} color={ORANGE} style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.premiumTitle}>Premium</Text>
                  <Text style={styles.premiumDesc}>Clean and manage your apps with advanced features and no more ads!</Text>
                </View>
              </View>
              <Pressable style={styles.upgradeOptionsBtn}><Text style={styles.upgradeOptionsBtnText}>UPGRADE OPTIONS</Text></Pressable>
              <Pressable style={styles.exploreBtn}><Text style={styles.exploreBtnText}>EXPLORE FEATURES</Text></Pressable>
            </View>
            {/* Storage Breakdown */}
            <Text style={styles.storageSectionTitle}>STORAGE</Text>
            <View style={styles.storageBreakdown}>
              {Object.entries(storageBreakdown).map(([label, value]) => (
                <View style={styles.storageRow} key={label}>
                  {storageIcons[label]}
                  <Text style={styles.storageLabelText}>{label}</Text>
                  <View style={{ flex: 1 }} />
                  <Text style={styles.storageValueText}>{value} {label === 'Audio' ? 'MB' : 'GB'}</Text>
                </View>
              ))}
            </View>
            {/* Menu Items */}
            <View style={styles.menuSection}>
              {menuItems.map((item, i) => (
                <View style={styles.menuRow} key={i}>
                  {item.icon}
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
            <View style={{ height: 32 }} />
          </ScrollView>
        </Animated.View>
      </Modal>
      {/* Main content with top gap */}
      <View style={{ flex: 1, paddingTop: 16 }}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => setDrawerOpen(true)} hitSlop={16} style={{ padding: 4, borderRadius: 20 }}>
              <Ionicons name="menu" size={32} color="#fff" />
            </Pressable>
            <Text style={styles.header}>Cleaner</Text>
          </View>
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
                <Pressable style={styles.quickCleanBtn} onPress={() => router.push('/scanning')}>
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
              <Text style={styles.gridValue}>{mediaCount > 0 ? `+ ${mediaCount} files` : 'No media found'}</Text>
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
    paddingHorizontal: 12,
    marginBottom: 14,
    minHeight: 44,
    height: 44,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 44,
    height: 44,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    minHeight: 44,
    lineHeight: 44,
    display: 'flex',
    alignItems: 'center',
  },
  upgradeBtn: {
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    shadowColor: ORANGE,
    shadowOpacity: 0.12,
    shadowRadius: 1,
    elevation: 1,
    alignSelf: 'center',
    minHeight: 28,
    height: 28,
    justifyContent: 'center',
  },
  upgradeBtnText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 0.8,
    lineHeight: 14,
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
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 320,
    height: '100%',
    backgroundColor: '#3A3F4B',
    zIndex: 2,
    paddingTop: 36,
    paddingHorizontal: 0,
    paddingBottom: 0,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 10,
  },
  drawerScrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 24,
    paddingTop: 0,
  },
  drawerHeader: {
    marginBottom: 28,
    marginTop: 4,
  },
  drawerLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  drawerLogoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    letterSpacing: 1,
  },
  premiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  premiumTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 2,
  },
  premiumDesc: {
    color: LIGHT_GREY,
    fontSize: 14,
    marginBottom: 0,
    maxWidth: 200,
  },
  upgradeOptionsBtn: {
    backgroundColor: ORANGE,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  upgradeOptionsBtnText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
  exploreBtn: {
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 18,
  },
  exploreBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
  storageSectionTitle: {
    color: LIGHT_GREY,
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 0,
    marginBottom: 10,
    letterSpacing: 1,
  },
  storageBreakdown: {
    marginBottom: 24,
  },
  storageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  storageLabelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  storageValueText: {
    color: LIGHT_GREY,
    fontWeight: 'bold',
    fontSize: 16,
  },
  menuSection: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#444B54',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginBottom: 2,
  },
  menuLabel: {
    color: '#fff',
    fontSize: 17,
    marginLeft: 14,
    fontWeight: 'bold',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
}); 