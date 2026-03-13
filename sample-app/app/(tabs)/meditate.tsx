import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 2;

export default function MeditateScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Meditate</Text>
        <Text style={styles.subtitle}>
          we can learn how to recognize when our minds{'\n'}are doing their normal everyday acrobatics.
        </Text>

        {/* Category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {['All', 'My', 'Anxious', 'Sleep', 'Kids'].map((cat, i) => (
            <TouchableOpacity key={cat} style={styles.chipItem}>
              <View style={[styles.chipCircle, i === 0 && styles.chipCircleActive]}>
                <Ionicons
                  name={
                    i === 0 ? 'grid' :
                    i === 1 ? 'heart' :
                    i === 2 ? 'sad-outline' :
                    i === 3 ? 'moon' :
                    'happy-outline'
                  }
                  size={20}
                  color={i === 0 ? '#FFFFFF' : '#A1A4B2'}
                />
              </View>
              <Text style={[styles.chipLabel, i === 0 && styles.chipLabelActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Daily Calm banner - image has text+button baked in */}
        <TouchableOpacity style={styles.dailyBanner}>
          <Image
            source={require('../../assets/images/meditate_daily_calm_banner.png')}
            style={styles.dailyBannerFull}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Meditation grid */}
        <View style={styles.gridRow}>
          {/* 7 Days of Calm - image has title baked in */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/course-details')}
          >
            <View style={styles.gridImageContainer}>
              <Image
                source={require('../../assets/images/meditate_7days_calm_card.png')}
                style={styles.gridImage}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>

          {/* Anxiety Release - illustration only, no text in image */}
          <TouchableOpacity style={styles.gridCard}>
            <View style={styles.gridImageContainer}>
              <Image
                source={require('../../assets/images/meditate_anxiety_release_card.png')}
                style={styles.gridImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.gridTitle}>Anxiet Release</Text>
          </TouchableOpacity>
        </View>

        {/* Second row */}
        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.gridCard}>
            <View style={[styles.gridImageContainer, { backgroundColor: '#A0E4CB' }]}>
              <Image
                source={require('../../assets/images/meditate_illustration_1.png')}
                style={styles.gridImage}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard}>
            <View style={[styles.gridImageContainer, { backgroundColor: '#F09EA1' }]}>
              <Image
                source={require('../../assets/images/meditate_illustration_2.png')}
                style={styles.gridImage}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        </View>

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
  },
  chipScroll: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  chipItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  chipCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.tabInactive,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  chipCircleActive: {
    backgroundColor: Colors.primary,
  },
  chipLabel: {
    fontSize: 14,
    color: Colors.textGray,
  },
  chipLabelActive: {
    color: Colors.textDark,
    fontWeight: '500',
  },
  dailyBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    height: 90,
  },
  dailyBannerFull: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  gridRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 16,
  },
  gridCard: {
    width: CARD_WIDTH,
  },
  gridImageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.95,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textLight,
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
});
