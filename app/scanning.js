import { Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
// import Svg, { Circle } from 'react-native-svg';
import * as MediaLibrary from 'expo-media-library';

const ORANGE = '#FFA500';
const BLACK = '#23272F';
const GREY = '#444B54';
const LIGHT_GREY = '#B0B6C3';
const SCREEN_WIDTH = Dimensions.get('window').width;

const scanSteps = [
  { label: 'Finding junk...', duration: 2000 },
  { label: 'Analyzing cached data...', duration: 2000 },
  { label: 'Detecting duplicate media...', duration: 2000 },
  { label: 'Almost done...', duration: 2000 },
];

export default function ScanningScreen() {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mediaStats, setMediaStats] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let percent = 0;
    let currentStep = 0;
    let interval;

    function nextStep() {
      if (currentStep < scanSteps.length) {
        const { duration } = scanSteps[currentStep];
        const startPercent = percent;
        const endPercent = Math.round(((currentStep + 1) / scanSteps.length) * 100);
        const stepIncr = (endPercent - startPercent) / (duration / 40);
        let elapsed = 0;
        interval = setInterval(() => {
          elapsed += 40;
          percent = Math.min(endPercent, percent + stepIncr);
          setProgress(Math.round(percent));
          if (percent >= endPercent) {
            clearInterval(interval);
            if (currentStep === 2) {
              // Actually scan for media files at step 3
              MediaLibrary.getAssetsAsync({ first: 1000000 }).then(assets => {
                setMediaStats({ count: assets.totalCount });
              });
            }
            currentStep++;
            setStepIdx(currentStep);
            setTimeout(nextStep, 200);
          }
        }, 40);
      } else {
        setProgress(100);
        setTimeout(() => {
          router.replace('/scan-complete');
        }, 1000);
      }
    }
    nextStep();
    return () => clearInterval(interval);
  }, [router]);

  // Dynamically center the percent text
  function getPercentTextOffset() {
    if (progress < 10) return -24;
    if (progress < 100) return -32;
    return -56; // for 100%, more negative to center three digits
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }} />
      <View style={styles.circleWrapper}>
        <CircularProgress percent={progress} />
        <Text style={[styles.percentText, { transform: [{ translateX: getPercentTextOffset() }, { translateY: -32 }] }]}>{progress}%</Text>
      </View>
      <Text style={styles.status}>{scanSteps[Math.min(stepIdx, scanSteps.length - 1)].label}</Text>
      <View style={{ flex: 2 }} />
      <View style={styles.bottomCard}>
        <Text style={styles.cardTitle}>Share your thoughts while you wait</Text>
        <Text style={styles.cardDesc}>What cleaning tips are important to you? This won't interrupt your scan.</Text>
        <Pressable style={styles.cardBtn}>
          <Text style={styles.cardBtnText}>CUSTOMIZE MY TIPS</Text>
        </Pressable>
      </View>
    </View>
  );
}

function CircularProgress({ percent }) {
  const radius = 100;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  return (
    <View style={{ width: 2 * radius, height: 2 * radius, borderRadius: radius, borderWidth: 8, borderColor: ORANGE, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: ORANGE, fontWeight: 'bold' }}>{Math.round(percent * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 0,
  },
  circleWrapper: {
    marginBottom: 24,
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 220,
    height: 220,
    alignSelf: 'center',
    position: 'relative',
  },
  percentText: {
    color: ORANGE,
    fontSize: 48,
    fontWeight: 'bold',
    position: 'absolute',
    top: '50%',
    left: '50%',
    // transform is set dynamically
  },
  status: {
    color: LIGHT_GREY,
    fontSize: 15,
    marginTop: 32,
    textAlign: 'center',
    fontWeight: 'normal',
    marginBottom: 0,
  },
  bottomCard: {
    width: SCREEN_WIDTH,
    backgroundColor: '#2C313A',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDesc: {
    color: LIGHT_GREY,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 2,
  },
  cardBtn: {
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  cardBtnText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  mediaInfo: {
    color: LIGHT_GREY,
    fontSize: 15,
    marginTop: 16,
  },
}); 