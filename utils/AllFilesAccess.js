import { NativeModules, Platform } from 'react-native';

export function openAllFilesAccessSettings() {
  if (Platform.OS === 'android' && NativeModules.AllFilesAccessModule) {
    NativeModules.AllFilesAccessModule.openAllFilesAccessSettings();
  }
} 