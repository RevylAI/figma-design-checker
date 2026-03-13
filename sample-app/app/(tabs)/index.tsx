import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
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
            <Image
              source={require('../../assets/images/home_basics_card_illustration.png')}
              style={styles.cardFullImage}
              resizeMode="cover"
            />
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
            <Image
              source={require('../../assets/images/home_relaxation_card_illustration.png')}
              style={styles.cardFullImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Daily Thought banner */}
        <TouchableOpacity style={styles.dailyThought}>
          <Image
            source={require('../../assets/images/home_daily_thought_banner.png')}
            style={styles.dailyBannerFull}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Recommended section */}
        <Text style={styles.sectionTitle}>Recomended for you</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedScroll}>
          {/* Focus card - image has title+subtitle baked in */}
          <TouchableOpacity style={styles.recommendedCard}>
            <Image
              source={require('../../assets/images/home_focus_card_illustration_1.png')}
              style={styles.recommendedFullImage}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Happiness card - image is illustration only */}
          <TouchableOpacity style={styles.recommendedCard}>
            <View style={[styles.recommendedImage, { backgroundColor: '#FFC97E' }]}>
              <Image
                source={require('../../assets/images/home_happiness_card_illustration.png')}
                style={styles.recommendedIllustration}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.recommendedTitle}>Happiness</Text>
            <Text style={styles.recommendedSub}>MEDITATION • 3-10 MIN</Text>
          </TouchableOpacity>

          {/* Third partial card */}
          <TouchableOpacity style={styles.recommendedCard}>
            <Image
              source={require('../../assets/images/home_focus_card_illustration_1.png')}
              style={styles.recommendedFullImage}
              resizeMode="cover"
            />
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
  cardFullImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    borderRadius: 16,
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
    height: 95,
  },
  dailyBannerFull: {
    width: '100%',
    height: '100%',
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
  recommendedIllustration: {
    width: '100%',
    height: '100%',
  },
  recommendedFullImage: {
    width: 160,
    height: 170,
    borderRadius: 12,
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
