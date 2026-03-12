import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function SleepPlayerScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#03174C', '#0A1F5C', '#152B6E']} style={styles.container}>
      <StatusBar style="light" />

      {/* Decorative blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.blob3} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="heart-outline" size={20} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="download-outline" size={20} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Center content */}
      <View style={styles.centerContent}>
        <Text style={styles.title}>Night Island</Text>
        <Text style={styles.subtitle}>SLEEP MUSIC</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.skipBtn}>
          <Ionicons name="play-back" size={20} color="rgba(255,255,255,0.4)" />
          <Text style={styles.skipText}>15</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playBtn}>
          <View style={styles.playBtnInner}>
            <Ionicons name="pause" size={28} color={Colors.sleepDark} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn}>
          <Ionicons name="play-forward" size={20} color="rgba(255,255,255,0.4)" />
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blob1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(30,50,100,0.4)',
    top: 100,
    right: -80,
  },
  blob2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(30,50,100,0.3)',
    top: 300,
    left: -60,
  },
  blob3: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(30,50,100,0.3)',
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    backgroundColor: 'rgba(255,255,255,0.08)',
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
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(235,235,245,0.5)',
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
    color: 'rgba(255,255,255,0.3)',
    marginTop: 2,
  },
  playBtn: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: 'rgba(142,151,253,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    width: '8%',
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
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
    color: 'rgba(235,235,245,0.4)',
  },
});
