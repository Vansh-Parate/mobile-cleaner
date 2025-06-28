import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#23272F" />
      <Stack 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#23272F',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShown: false,
        }}
      />
    </>
  );
} 