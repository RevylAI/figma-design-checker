import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

export default function PlayerScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Decorative blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.blob3} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color={Colors.textDark} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="heart-outline" size={20} color={Colors.textGray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="download-outline" size={20} color={Colors.textGray} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Center content */}
      <View style={styles.centerContent}>
        <Text style={styles.title}>Focus Attention</Text>
        <Text style={styles.subtitle}>7 DAYS OF CALM</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.skipBtn}>
          <Ionicons name="play-back" size={20} color={Colors.textGray} />
          <Text style={styles.skipText}>15</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playBtn}>
          <View style={styles.playBtnInner}>
            <Ionicons name="pause" size={28} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn}>
          <Ionicons name="play-forward" size={20} color={Colors.textGray} />
          <Text style={styles.skipText}>15</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
          <View style={styles.progressDot} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>01:30</Text>
          <Text style={styles.timeText}>45:00</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  blob1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(235,228,218,0.5)',
    top: 100,
    right: -80,
  },
  blob2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(235,228,218,0.4)',
    top: 300,
    left: -60,
  },
  blob3: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(235,228,218,0.3)',
    bottom: 200,
    right: -40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  closeBtn: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(200,200,200,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textDark,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textGray,
    letterSpacing: 1,
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 30,
  },
  skipBtn: {
    alignItems: 'center',
  },
  skipText: {
    fontSize: 10,
    color: Colors.textGray,
    marginTop: 2,
  },
  playBtn: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: 'rgba(200,200,200,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.textDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#D9D9D9',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    width: '8%',
    height: '100%',
    backgroundColor: Colors.textDark,
    borderRadius: 2,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.textDark,
    position: 'absolute',
    top: -3,
    left: '7%',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 14,
    color: Colors.textGray,
  },
});
