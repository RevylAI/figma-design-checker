import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 2;

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>S i l e n t</Text>
          <View style={styles.logoIcon}>
            <View style={styles.logoShape} />
          </View>
          <Text style={styles.logoText}>M o o n</Text>
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>Good Morning, Afsar</Text>
        <Text style={styles.greetingSub}>We Wish you have a good day</Text>

        {/* Two feature cards */}
        <View style={styles.cardsRow}>
          {/* Basics card */}
          <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: Colors.cardPurple }]}
            onPress={() => router.push('/course-details')}
          >
            <View style={styles.cardIllustration}>
              <View style={styles.basicsBlobA} />
              <View style={styles.basicsBlobB} />
            </View>
            <Text style={styles.cardTitle}>Basics</Text>
            <Text style={styles.cardSubtitle}>COURSE</Text>
            <View style={styles.cardBottom}>
              <Text style={styles.cardDuration}>3-10 MIN</Text>
              <TouchableOpacity style={styles.startButtonLight}>
                <Text style={styles.startTextLight}>START</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Relaxation card */}
          <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: Colors.cardYellow }]}
          >
            <View style={styles.cardIllustration}>
              <View style={styles.relaxBlobA} />
              <View style={styles.relaxBlobB} />
            </View>
            <Text style={[styles.cardTitle, { color: Colors.textDark }]}>Relaxation</Text>
            <Text style={[styles.cardSubtitle, { color: Colors.textDark, opacity: 0.6 }]}>MUSIC</Text>
            <View style={styles.cardBottom}>
              <Text style={[styles.cardDuration, { color: Colors.textDark, opacity: 0.6 }]}>3-10 MIN</Text>
              <TouchableOpacity style={styles.startButtonDark}>
                <Text style={styles.startTextDark}>START</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Daily Thought banner */}
        <TouchableOpacity style={styles.dailyThought}>
          <LinearGradient
            colors={['#333242', '#44435A']}
            style={styles.dailyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View>
              <Text style={styles.dailyTitle}>Daily Thought</Text>
              <Text style={styles.dailySubtitle}>MEDITATION • 3-10 MIN</Text>
            </View>
            <View style={styles.playCircle}>
              <Ionicons name="play" size={18} color={Colors.textDark} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Recommended section */}
        <Text style={styles.sectionTitle}>Recomended for you</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedScroll}>
          {/* Focus card */}
          <TouchableOpacity style={styles.recommendedCard}>
            <View style={[styles.recommendedImage, { backgroundColor: '#A0E4CB' }]}>
              <View style={styles.recIllustration1} />
            </View>
            <Text style={styles.recommendedTitle}>Focus</Text>
            <Text style={styles.recommendedSub}>MEDITATION • 3-10 MIN</Text>
          </TouchableOpacity>

          {/* Happiness card */}
          <TouchableOpacity style={styles.recommendedCard}>
            <View style={[styles.recommendedImage, { backgroundColor: '#FFC97E' }]}>
              <View style={styles.recIllustration2} />
            </View>
            <Text style={styles.recommendedTitle}>Happiness</Text>
            <Text style={styles.recommendedSub}>MEDITATION • 3-10 MIN</Text>
          </TouchableOpacity>

          {/* Third partial card */}
          <TouchableOpacity style={styles.recommendedCard}>
            <View style={[styles.recommendedImage, { backgroundColor: '#A0E4CB' }]}>
              <View style={styles.recIllustration1} />
            </View>
            <Text style={styles.recommendedTitle}>Focus</Text>
            <Text style={styles.recommendedSub}>MEDITATION • 3-10 MIN</Text>
          </TouchableOpacity>
        </ScrollView>

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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  logoText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    letterSpacing: 2,
  },
  logoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoShape: {
    width: 10,
    height: 7,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textDark,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  greetingSub: {
    fontSize: 16,
    color: Colors.textGray,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  cardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 24,
  },
  featureCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.35,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  cardIllustration: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  basicsBlobA: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  basicsBlobB: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    position: 'absolute',
    right: 30,
    top: 5,
  },
  relaxBlobA: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  relaxBlobB: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    position: 'absolute',
    left: 30,
    top: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textLight,
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cardDuration: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  startButtonLight: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
  },
  startTextLight: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textDark,
  },
  startButtonDark: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.textDark,
    borderRadius: 20,
  },
  startTextDark: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textLight,
  },
  dailyThought: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dailyGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    height: 95,
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textLight,
  },
  dailySubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  playCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.textLight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textDark,
    paddingHorizontal: 20,
    marginTop: 28,
  },
  recommendedScroll: {
    paddingLeft: 20,
    marginTop: 16,
  },
  recommendedCard: {
    marginRight: 16,
    width: 160,
  },
  recommendedImage: {
    width: 160,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recIllustration1: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  recIllustration2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: 8,
  },
  recommendedSub: {
    fontSize: 11,
    color: Colors.textGray,
    marginTop: 4,
    letterSpacing: 0.3,
  },
});
