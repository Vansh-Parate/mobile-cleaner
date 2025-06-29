import { View, Text, Pressable, StyleSheet, Image, Linking, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const ORANGE = '#FFA500';
const BLACK = '#23272F';

export default function WelcomeScreen() {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [mediaCount, setMediaCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/access-scan');
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://placehold.co/160x160?text=Logo' }} style={styles.logo} />
      <Text style={styles.title}>Cleaner</Text>
      <View style={{ flex: 1 }} />
      <Text style={styles.info}>
        Using this app and its features requires access to data about your installed apps which we collect and store locally to provide you with tips on space optimization and phone functionality.{"\n"}{"\n"}
        By proceeding, you confirm you accept Cleaner's{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://www.avg.com/eula')}>Agreement</Text>
        {' '}and{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://www.avg.com/privacy')}>Privacy Policy</Text>.
      </Text>
      <Pressable style={styles.button} onPress={handleGetStarted} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'CHECKING...' : 'GET STARTED'}</Text>
      </Pressable>
      {mediaCount !== null && (
        <Text style={styles.resultText}>Media files found: {mediaCount}</Text>
      )}
      <View style={{ height: 32 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
    marginTop: 8,
  },
  info: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  link: {
    color: ORANGE,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    maxWidth: 340,
  },
  buttonText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  resultText: {
    color: ORANGE,
    fontSize: 16,
    marginTop: 24,
    fontWeight: 'bold',
  },
}); 