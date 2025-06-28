import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms & Conditions</Text>
      <Text style={styles.text}>
        Please accept our Terms & Conditions to continue using the Mobile Cleaner app.
      </Text>
      <Button title="Accept" onPress={() => { /* Permissions logic will go here */ }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#444',
    marginBottom: 32,
    textAlign: 'center',
  },
}); 