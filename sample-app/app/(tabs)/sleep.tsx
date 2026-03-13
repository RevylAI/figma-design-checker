import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
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
          <ImageBackground
            source={require('../../assets/images/sleep_ocean_scene_bitmap.png')}
            style={styles.featuredGradient}
            imageStyle={styles.featuredBackgroundImage}
            resizeMode="cover"
          >
            <View style={styles.lockIcon}>
              <Ionicons name="lock-closed" size={14} color="rgba(255,255,255,0.6)" />
            </View>
            <Text style={styles.featuredTitle}>The Ocean Moon</Text>
            <Text style={styles.featuredSub}>
              Non-stop 8- hour mixes of our{'\n'}most popular sleep audio
            </Text>
            <TouchableOpacity style={styles.featuredStartBtn}>
              <Text style={styles.featuredStartText}>START</Text>
            </TouchableOpacity>
          </ImageBackground>
        </TouchableOpacity>

        {/* Story cards grid */}
        <View style={styles.cardsRow}>
          <TouchableOpacity
            style={styles.storyCard}
            onPress={() => router.push('/sleep-music')}
          >
            <Image
              source={require('../../assets/images/sleep_night_island_card.png')}
              style={styles.storyFullImage}
              resizeMode="cover"
            />
            <Text style={styles.storyTitle}>Night Island</Text>
            <Text style={styles.storySub}>45 MIN • SLEEP MUSIC</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.storyCard}>
            <Image
              source={require('../../assets/images/sleep_sweet_sleep_card.png')}
              style={styles.storyFullImage}
              resizeMode="cover"
            />
            <Text style={styles.storyTitle}>Sweet Sleep</Text>
            <Text style={styles.storySub}>45 MIN • SLEEP MUSIC</Text>
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
    minHeight: 260,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#586894',
  },
  featuredBackgroundImage: {
    borderRadius: 16,
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
  cardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 20,
  },
  storyCard: {
    width: CARD_WIDTH,
  },
  storyFullImage: {
    width: '100%',
    height: CARD_WIDTH * 1.05,
    borderRadius: 12,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textLight,
    marginTop: 8,
  },
  storySub: {
    fontSize: 11,
    color: 'rgba(235,235,245,0.5)',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
