import { View, Text, StyleSheet, Pressable, ScrollView, Modal, ActivityIndicator, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';

const ORANGE = '#FFA500';
const BLACK = '#23272F';
const GREY = '#444B54';
const CARD_BG = '#292D36';
const DIVIDER = '#23272F';
const LIGHT_GREY = '#B0B6C3';

const advancedSections = [
  { key: 'hidden', label: 'Hidden caches', desc: 'Advanced cleaning requires additional permissions.', locked: true },
  { key: 'browser', label: 'Browser data', desc: 'Advanced cleaning requires additional permissions.', locked: true },
  { key: 'trash', label: 'Trash', desc: 'Advanced cleaning required to access system trash.', locked: true },
  { key: 'appdata', label: 'App data', desc: 'Advanced cleaning required to access app data.', locked: true },
];

export default function CleanResultsScreen() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [emptyFolders, setEmptyFolders] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [largeOldFiles, setLargeOldFiles] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [selected, setSelected] = useState({ visible: true, empty: true });
  const [expanded, setExpanded] = useState({ empty: false, visible: false, thumbs: false, large: false, downloads: false });
  const [selectedFolders, setSelectedFolders] = useState({});
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showCleaning, setShowCleaning] = useState(false);

  useEffect(() => {
    // Fetch media files (visible caches)
    MediaLibrary.getAssetsAsync({ first: 1000 }).then(assets => {
      setMediaFiles(assets.assets.map(a => ({ id: a.id, filename: a.filename, size: a.fileSize, uri: a.uri })));
      // Thumbnails: small images (<100KB)
      setThumbnails(assets.assets.filter(a => a.mediaType === 'photo' && a.fileSize && a.fileSize < 100 * 1024).map(a => ({ id: a.id, filename: a.filename, size: a.fileSize, uri: a.uri })));
      // Large old files: >100MB and older than 1 month
      const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      setLargeOldFiles(assets.assets.filter(a => a.fileSize && a.fileSize > 100 * 1024 * 1024 && a.creationTime && a.creationTime < oneMonthAgo).map(a => ({ id: a.id, filename: a.filename, size: a.fileSize, uri: a.uri })));
    });
    // Find empty folders in app's document directory
    (async () => {
      const dirs = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      const empties = [];
      for (const dir of dirs) {
        const fullPath = FileSystem.documentDirectory + dir + '/';
        try {
          const files = await FileSystem.readDirectoryAsync(fullPath);
          if (files.length === 0) empties.push({ name: dir, size: '4.1 kB' }); // Size is simulated
        } catch {}
      }
      setEmptyFolders(empties);
      setSelectedFolders(Object.fromEntries(empties.map(f => [f.name, true])));
    })();
    // Downloads (if accessible)
    (async () => {
      try {
        const downloadDir = FileSystem.documentDirectory + 'Download/';
        const files = await FileSystem.readDirectoryAsync(downloadDir);
        setDownloads(files.map(f => ({ name: f, size: 'unknown' })));
      } catch {
        setDownloads([]);
      }
    })();
  }, []);

  const toggleFolder = (name) => {
    setSelectedFolders((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleExpand = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleFinishCleaning = () => setShowModal(true);
  const handleClear = () => {
    setShowModal(false);
    setShowCleaning(true);
    setTimeout(() => {
      setShowCleaning(false);
      router.push('/advanced-issues');
    }, 2000);
  };
  const handleCancel = () => setShowModal(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal overlays - OUTSIDE the padded main content */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="trash-outline" size={36} color={ORANGE} style={{ marginBottom: 12 }} />
            <Text style={styles.modalTitle}>Clear temporary app files</Text>
            <Text style={styles.modalDesc}>
              Cleaner would like to clear some temporary files. This may result in an increased usage of battery or mobile data.
            </Text>
            <View style={styles.modalBtnRow}>
              <Pressable onPress={handleCancel} style={styles.modalBtn}>
                <Text style={[styles.modalBtnText, { color: LIGHT_GREY }]}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleClear} style={styles.modalBtn}>
                <Text style={[styles.modalBtnText, { color: ORANGE }]}>Clear</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={showCleaning} transparent animationType="fade">
        <View style={styles.cleaningOverlay}>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <View style={styles.broomCircle}>
              <MaterialCommunityIcons name="broom" size={64} color={LIGHT_GREY} />
            </View>
            <ActivityIndicator size="large" color={ORANGE} style={{ marginTop: 32 }} />
            <Text style={styles.cleaningText}>Cleaning junk...</Text>
          </View>
        </View>
      </Modal>
      {/* Main content with top gap */}
      <View style={{ flex: 1, paddingTop: 32 }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </Pressable>
          <Text style={styles.header}>Quick Clean</Text>
          <Pressable onPress={() => router.push('/quick-clean-settings')}>
            <Ionicons name="settings-outline" size={26} color="#fff" />
          </Pressable>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
          <Text style={styles.sectionTitle}>UNNEEDED FILES</Text>
          <Text style={styles.sectionDesc}>Files that are safe to delete and won't impact your device's functionality.</Text>
          {/* Advanced cleaning sections with lock */}
          {advancedSections.slice(0, 2).map((item) => (
            <View key={item.key} style={styles.card}>
              <Ionicons name="lock-closed" size={22} color={ORANGE} style={styles.checkbox} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
          <View style={styles.card}>
            <Pressable
              style={styles.checkbox}
              onPress={() => setSelected((s) => ({ ...s, visible: !s.visible }))}
            >
              {selected.visible ? (
                <Ionicons name="checkbox" size={22} color={ORANGE} />
              ) : (
                <Ionicons name="square-outline" size={22} color={GREY} />
              )}
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Visible caches</Text>
              <Text style={styles.cardDesc}>{mediaFiles.length} media files</Text>
              {expanded.visible && mediaFiles.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  {mediaFiles.map((file) => (
                    <View key={file.id} style={styles.folderRow}>
                      <Ionicons name="image-outline" size={20} color={ORANGE} style={{ marginRight: 8 }} />
                      <Text style={styles.folderName}>{file.filename}</Text>
                      <Text style={styles.folderSize}>{file.size ? (file.size / 1024).toFixed(1) + ' KB' : ''}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <Pressable onPress={() => toggleExpand('visible')}>
              <Ionicons name={expanded.visible ? "chevron-up" : "chevron-down"} size={22} color={GREY} style={{ marginLeft: 8 }} />
            </Pressable>
          </View>
          <View style={styles.card}>
            <View style={styles.checkbox} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Thumbnails</Text>
              <Text style={styles.cardDesc}>{thumbnails.length} found</Text>
              {expanded.thumbs && thumbnails.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  {thumbnails.map((file) => (
                    <View key={file.id} style={styles.folderRow}>
                      <Ionicons name="image-outline" size={20} color={ORANGE} style={{ marginRight: 8 }} />
                      <Text style={styles.folderName}>{file.filename}</Text>
                      <Text style={styles.folderSize}>{file.size ? (file.size / 1024).toFixed(1) + ' KB' : ''}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <Pressable onPress={() => toggleExpand('thumbs')}>
              <Ionicons name={expanded.thumbs ? "chevron-up" : "chevron-down"} size={22} color={GREY} style={{ marginLeft: 8 }} />
            </Pressable>
          </View>
          <View style={styles.card}>
            <Pressable
              style={styles.checkbox}
              onPress={() => setSelected((s) => ({ ...s, empty: !s.empty }))}
            >
              {selected.empty ? (
                <Ionicons name="checkbox" size={22} color={ORANGE} />
              ) : (
                <Ionicons name="square-outline" size={22} color={GREY} />
              )}
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Empty folders</Text>
              <Text style={styles.cardDesc}>{emptyFolders.length} found in app storage</Text>
              {expanded.empty && emptyFolders.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  {emptyFolders.map((folder) => (
                    <View key={folder.name} style={styles.folderRow}>
                      <Ionicons name="folder-outline" size={20} color={ORANGE} style={{ marginRight: 8 }} />
                      <Text style={styles.folderName}>{folder.name}</Text>
                      <Text style={styles.folderSize}>{folder.size}</Text>
                      <Pressable onPress={() => toggleFolder(folder.name)}>
                        {selectedFolders[folder.name] ? (
                          <Ionicons name="checkbox" size={18} color={ORANGE} />
                        ) : (
                          <Ionicons name="square-outline" size={18} color={GREY} />
                        )}
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <Pressable onPress={() => toggleExpand('empty')}>
              <Ionicons name={expanded.empty ? "chevron-up" : "chevron-down"} size={22} color={GREY} style={{ marginLeft: 8 }} />
            </Pressable>
          </View>
          {/* Divider and FILES TO REVIEW section */}
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionTitle}>FILES TO REVIEW</Text>
          <Text style={styles.sectionDesc}>Files that may be valuable to you. Review before deleting.</Text>
          {advancedSections.slice(2).map((item) => (
            <View key={item.key} style={styles.card}>
              <Ionicons name="lock-closed" size={22} color={ORANGE} style={styles.checkbox} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
          <View style={styles.card}>
            <View style={styles.checkbox} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Large old files</Text>
              <Text style={styles.cardDesc}>{largeOldFiles.length} found</Text>
              {expanded.large && largeOldFiles.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  {largeOldFiles.map((file) => (
                    <View key={file.id} style={styles.folderRow}>
                      <Ionicons name="document" size={20} color={ORANGE} style={{ marginRight: 8 }} />
                      <Text style={styles.folderName}>{file.filename}</Text>
                      <Text style={styles.folderSize}>{file.size ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : ''}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <Pressable onPress={() => toggleExpand('large')}>
              <Ionicons name={expanded.large ? "chevron-up" : "chevron-down"} size={22} color={GREY} style={{ marginLeft: 8 }} />
            </Pressable>
          </View>
          <View style={styles.card}>
            <View style={styles.checkbox} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Downloads</Text>
              <Text style={styles.cardDesc}>{downloads.length} found</Text>
              {expanded.downloads && downloads.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  {downloads.map((file) => (
                    <View key={file.name} style={styles.folderRow}>
                      <Ionicons name="document" size={20} color={ORANGE} style={{ marginRight: 8 }} />
                      <Text style={styles.folderName}>{file.name}</Text>
                      <Text style={styles.folderSize}>{file.size}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <Pressable onPress={() => toggleExpand('downloads')}>
              <Ionicons name={expanded.downloads ? "chevron-up" : "chevron-down"} size={22} color={GREY} style={{ marginLeft: 8 }} />
            </Pressable>
          </View>
          <Text style={styles.selectedText}>{Object.values(selected).filter(Boolean).length} SELECTED</Text>
        </ScrollView>
        <Pressable style={styles.cleanBtn} onPress={handleFinishCleaning}>
          <Text style={styles.cleanBtnText}>FINISH CLEANING</Text>
        </Pressable>
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
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 4,
    marginLeft: 18,
    letterSpacing: 1,
  },
  sectionDesc: {
    color: LIGHT_GREY,
    fontSize: 15,
    marginLeft: 18,
    marginBottom: 16,
    marginTop: 0,
  },
  sectionDivider: {
    height: 1.5,
    backgroundColor: DIVIDER,
    marginVertical: 18,
    marginHorizontal: 10,
    borderRadius: 1,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  checkbox: {
    marginRight: 16,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 2,
  },
  cardDesc: {
    color: LIGHT_GREY,
    fontSize: 15,
    marginTop: 2,
  },
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginLeft: 8,
  },
  folderName: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  folderSize: {
    color: ORANGE,
    fontSize: 13,
    marginLeft: 8,
    marginRight: 8,
  },
  selectedText: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  cleanBtn: {
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 24,
  },
  cleanBtnText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#231F20',
    borderRadius: 18,
    padding: 28,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDesc: {
    color: LIGHT_GREY,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cleaningOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  broomCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: LIGHT_GREY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  cleaningText: {
    color: LIGHT_GREY,
    fontSize: 18,
    marginTop: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 