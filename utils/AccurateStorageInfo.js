import { NativeModules } from 'react-native';
const { AccurateStorageInfo } = NativeModules;

export async function getAccurateStorageInfo() {
  if (AccurateStorageInfo && AccurateStorageInfo.getStorageInfo) {
    try {
      return await AccurateStorageInfo.getStorageInfo();
    } catch (e) {
      return null;
    }
  }
  return null;
} 