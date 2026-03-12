import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

export default function MusicScreen() {
  const router = useRouter();

  const tracks = [
    { title: 'Focus Attention', subtitle: '7 DAYS OF CALM', duration: '45:00', color: ['#F0ECE3', '#E8E0D4'] },
    { title: 'Night Island', subtitle: 'SLEEP MUSIC', duration: '45:00', color: ['#03174C', '#1A2F6E'] },
    { title: 'Relaxation Mix', subtitle: 'MEDITATION', duration: '30:00', color: ['#8E97FD', '#A5AEF7'] },
    { title: 'Ocean Waves', subtitle: 'NATURE SOUNDS', duration: '60:00', color: ['#586894', '#7B93BD'] },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Music</Text>
        <Text style={styles.subtitle}>
          Explore our curated collection of calming{'\n'}music for meditation and sleep.
        </Text>

        {tracks.map((track, i) => (
          <TouchableOpacity
            key={i}
            style={styles.trackCard}
            onPress={() => {
              if (track.color[0] === '#03174C') {
                router.push('/sleep-player');
              } else {
                router.push('/player');
              }
            }}
          >
            <LinearGradient
              colors={track.color as [string, string]}
              style={styles.trackGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.trackInfo}>
                <Text style={[
                  styles.trackTitle,
                  track.color[0] !== '#F0ECE3' && { color: '#FFFFFF' },
                ]}>
                  {track.title}
                </Text>
                <Text style={[
                  styles.trackSub,
                  track.color[0] !== '#F0ECE3' && { color: 'rgba(255,255,255,0.6)' },
                ]}>
                  {track.subtitle} • {track.duration}
                </Text>
              </View>
              <View style={[
                styles.playBtn,
                track.color[0] === '#F0ECE3' && { backgroundColor: Colors.textDark },
              ]}>
                <Ionicons
                  name="play"
                  size={18}
                  color={track.color[0] === '#F0ECE3' ? '#FFFFFF' : Colors.textDark}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textGray,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    marginBottom: 20,
  },
  trackCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  trackGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    height: 90,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
  },
  trackSub: {
    fontSize: 11,
    color: Colors.textGray,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3,
  },
});
