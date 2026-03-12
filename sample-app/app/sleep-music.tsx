import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { SLEEP_STORIES } from '../constants/Data';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 2;

export default function SleepMusicScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Sleep Music</Text>
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {SLEEP_STORIES.map((story, i) => (
            <TouchableOpacity
              key={`${story.id}-${i}`}
              style={styles.card}
              onPress={() => router.push('/sleep-player')}
            >
              <LinearGradient
                colors={[story.color, '#4A5688']}
                style={styles.cardImage}
              >
                {/* Moon/cloud illustration */}
                <View style={styles.cardMoon} />
                <View style={styles.cardCloud} />
                {i % 2 === 1 && <View style={styles.cardBranch} />}
              </LinearGradient>
              <Text style={styles.cardTitle}>{story.title}</Text>
              <Text style={styles.cardMeta}>{story.duration} • {story.type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.sleepDark,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textLight,
    marginLeft: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 8,
  },
  cardImage: {
    width: '100%',
    height: 130,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardMoon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: 'rgba(255,201,126,0.6)',
    position: 'absolute',
    top: 15,
    right: 25,
  },
  cardCloud: {
    width: 50,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(168,216,234,0.4)',
    position: 'absolute',
    bottom: 30,
    left: 15,
  },
  cardBranch: {
    width: 80,
    height: 3,
    backgroundColor: 'rgba(180,160,200,0.3)',
    borderRadius: 2,
    position: 'absolute',
    bottom: 40,
    transform: [{ rotate: '-8deg' }],
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textLight,
    marginTop: 8,
  },
  cardMeta: {
    fontSize: 11,
    color: 'rgba(235,235,245,0.5)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
