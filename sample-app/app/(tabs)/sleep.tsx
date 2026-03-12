import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 2;

export default function SleepScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header with moon */}
        <View style={styles.header}>
          <View style={styles.moonContainer}>
            <View style={styles.moon} />
            <View style={styles.moonShadow} />
          </View>
          <View style={styles.star1} />
          <View style={styles.star2} />
          <View style={styles.star3} />
          <View style={styles.star4} />
        </View>

        <Text style={styles.title}>Sleep Stories</Text>
        <Text style={styles.subtitle}>
          Soothing bedtime stories to help you fall{'\n'}into a deep and natural sleep
        </Text>

        {/* Category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {['All', 'My', 'Anxious', 'Sleep', 'Kids'].map((cat, i) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, i === 0 && styles.chipActive]}
            >
              <View style={styles.chipIcon}>
                <Ionicons
                  name={
                    i === 0 ? 'grid' :
                    i === 1 ? 'heart' :
                    i === 2 ? 'sad-outline' :
                    i === 3 ? 'moon' :
                    'happy-outline'
                  }
                  size={20}
                  color={i === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.6)'}
                />
              </View>
              <Text style={[styles.chipText, i === 0 && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured: The Ocean Moon */}
        <TouchableOpacity
          style={styles.featured}
          onPress={() => router.push('/welcome-sleep')}
        >
          <LinearGradient
            colors={['#586894', '#8BA4D0']}
            style={styles.featuredGradient}
          >
            <View style={styles.lockIcon}>
              <Ionicons name="lock-closed" size={14} color="rgba(255,255,255,0.6)" />
            </View>
            <View style={styles.featuredMoonIcon} />
            <Text style={styles.featuredTitle}>The Ocean Moon</Text>
            <Text style={styles.featuredSub}>
              Non-stop 8- hour mixes of our{'\n'}most popular sleep audio
            </Text>
            <TouchableOpacity style={styles.featuredStartBtn}>
              <Text style={styles.featuredStartText}>START</Text>
            </TouchableOpacity>
            {/* Mountain silhouette */}
            <View style={styles.mountains}>
              <View style={styles.mountainA} />
              <View style={styles.mountainB} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Story cards grid */}
        <View style={styles.cardsRow}>
          <TouchableOpacity
            style={styles.storyCard}
            onPress={() => router.push('/sleep-music')}
          >
            <LinearGradient
              colors={['#586894', '#7B93BD']}
              style={styles.storyImage}
            >
              <View style={styles.storyMoon} />
              <View style={styles.storyCloud} />
            </LinearGradient>
            <Text style={styles.storyTitle}>Night Island</Text>
            <Text style={styles.storyMeta}>45 MIN • SLEEP MUSIC</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.storyCard}>
            <LinearGradient
              colors={['#7B68C4', '#9B8DE0']}
              style={styles.storyImage}
            >
              <View style={styles.storyBranch} />
            </LinearGradient>
            <Text style={styles.storyTitle}>Sweet Sleep</Text>
            <Text style={styles.storyMeta}>45 MIN • SLEEP MUSIC</Text>
          </TouchableOpacity>
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
    paddingBottom: 20,
  },
  header: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 50,
    position: 'relative',
  },
  moonContainer: {
    position: 'relative',
  },
  moon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8E8F0',
  },
  moonShadow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.sleepDark,
    position: 'absolute',
    top: -3,
    left: 10,
  },
  star1: { position: 'absolute', top: 55, left: 30, width: 4, height: 4, backgroundColor: '#E8E8F0', borderRadius: 2 },
  star2: { position: 'absolute', top: 65, right: 30, width: 5, height: 5, backgroundColor: '#E8E8F0', borderRadius: 3 },
  star3: { position: 'absolute', top: 75, right: 60, width: 3, height: 3, backgroundColor: '#B0B0C0', borderRadius: 2 },
  star4: { position: 'absolute', top: 55, right: 50, width: 4, height: 4, backgroundColor: '#B0B0C0', borderRadius: 2 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textLight,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(235,235,245,0.6)',
    paddingHorizontal: 20,
    marginTop: 8,
    lineHeight: 24,
  },
  chipScroll: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  chip: {
    alignItems: 'center',
    marginRight: 20,
  },
  chipActive: {},
  chipIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.sleepAccent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  chipText: {
    fontSize: 14,
    color: 'rgba(235,235,245,0.6)',
  },
  chipTextActive: {
    color: Colors.textLight,
  },
  featured: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredGradient: {
    padding: 24,
    minHeight: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  lockIcon: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredMoonIcon: {
    position: 'absolute',
    top: 12,
    right: 40,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  featuredTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFECCC',
    textAlign: 'center',
  },
  featuredSub: {
    fontSize: 14,
    color: 'rgba(235,235,245,0.7)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  featuredStartBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 24,
    marginTop: 16,
  },
  featuredStartText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textDark,
    letterSpacing: 0.5,
  },
  mountains: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    flexDirection: 'row',
  },
  mountainA: {
    width: 0,
    height: 0,
    borderLeftWidth: width / 3,
    borderRightWidth: width / 3,
    borderBottomWidth: 50,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(0,30,60,0.4)',
    position: 'absolute',
    left: -20,
    bottom: 0,
  },
  mountainB: {
    width: 0,
    height: 0,
    borderLeftWidth: width / 4,
    borderRightWidth: width / 4,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(0,20,50,0.5)',
    position: 'absolute',
    right: -20,
    bottom: 0,
  },
  cardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 20,
  },
  storyCard: {
    width: CARD_WIDTH,
  },
  storyImage: {
    width: '100%',
    height: 130,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  storyMoon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFC97E',
    position: 'absolute',
    top: 20,
    right: 30,
  },
  storyCloud: {
    width: 60,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#A8D8EA',
    position: 'absolute',
    bottom: 30,
    left: 20,
  },
  storyBranch: {
    width: 100,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    transform: [{ rotate: '-10deg' }],
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textLight,
    marginTop: 8,
  },
  storyMeta: {
    fontSize: 11,
    color: 'rgba(235,235,245,0.5)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
