import { View, Text, StyleSheet, Pressable, Alert, SafeAreaView, Linking, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import DeviceInfo from 'react-native-device-info';
import * as Application from 'expo-application';
import { openAllFilesAccessSettings } from '../utils/AllFilesAccess';

const ORANGE = '#FFA500';
const BLACK = '#23272F';
const GREEN = '#3DDC97';
const GREY = '#444B54';
const LIGHT_GREY = '#B0B6C3';

export default function AccessScanScreen() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [step, setStep] = useState(1);
  const [freeSpace, setFreeSpace] = useState('--');
  const router = useRouter();
  // Dummy storage values for now
  const usedPercent = 75;

  useEffect(() => {
    async function fetchFreeSpace() {
      try {
        const free = await DeviceInfo.getFreeDiskStorage();
        setFreeSpace((free / (1024 * 1024 * 1024)).toFixed(2)); // GB
      } catch (e) {
        setFreeSpace('--');
      }
    }
    fetchFreeSpace();
  }, []);

  const handlePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 30) {
      openAllFilesAccessSettings();
      return;
    }
    // Fallback for older Android or iOS
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      setPermissionGranted(true);
      setStep(2);
    } else {
      Alert.alert('Permission Required', 'Storage permission is required to scan and clean your device. Please enable it in settings.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Main content with top gap */}
      <View style={{ flex: 1, paddingTop: 32 }}>
        <Text style={styles.header}>One down, one to go!</Text>
        <View style={styles.illustration}>
          {/* Placeholder for illustration */}
          <Text style={{color: GREEN, fontSize: 80}}>📱</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={{alignItems: 'center', marginRight: 32}}>
            <Text style={styles.statsValue}>{freeSpace} <Text style={{fontSize: 18}}>GB</Text></Text>
            <Text style={styles.statsLabel}>Free space</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={[styles.statsValue, {color: GREEN}]}>{usedPercent} <Text style={{fontSize: 18}}>%</Text></Text>
            <Text style={styles.statsLabel}>Used space</Text>
          </View>
        </View>
        <View style={{height: 32}} />
        <View style={styles.stepper}>
          <View style={styles.stepRow}>
            <View style={[styles.circle, {backgroundColor: permissionGranted ? GREEN : ORANGE}]}> 
              <Text style={styles.circleText}>1</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.stepTitle}>Give us access</Text>
              <Text style={styles.stepDesc}>We need permission to clean your photos, media, and files.</Text>
            </View>
            <Pressable onPress={handlePermission} disabled={permissionGranted} style={({pressed}) => [styles.arrowBtn, {opacity: permissionGranted ? 0.5 : 1}]}> 
              <Text style={{fontSize: 22, color: permissionGranted ? GREY : GREEN}}>&#8594;</Text>
            </Pressable>
          </View>
          <View style={styles.stepRow}>
            <View style={[styles.circle, {backgroundColor: permissionGranted ? ORANGE : GREY}]}> 
              <Text style={styles.circleText}>2</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.stepTitle}>Scan for junk</Text>
              <Text style={styles.stepDesc}>We'll show you what can be safely removed to free up space.</Text>
            </View>
          </View>
        </View>
        <View style={{flex: 1}} />
        <Pressable
          style={[styles.resultsBtn, {backgroundColor: permissionGranted ? ORANGE : GREY}]}
          disabled={!permissionGranted}
          onPress={() => {
            if (permissionGranted) router.push('/scanning');
          }}
        >
          <Text style={styles.resultsBtnText}>SEE RESULTS</Text>
        </Pressable>
        <View style={{ height: 32 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
    padding: 24,
    paddingTop: 32,
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
  stepper: {
    marginTop: 32,
    marginBottom: 32,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  circleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  stepTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepDesc: {
    color: LIGHT_GREY,
    fontSize: 15,
    marginTop: 2,
  },
  arrowBtn: {
    padding: 8,
  },
  resultsBtn: {
    marginTop: 0,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
  },
  resultsBtnText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
}); 