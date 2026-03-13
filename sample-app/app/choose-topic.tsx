import { View, Text, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { TOPICS } from '../constants/Data';

const { width } = Dimensions.get('window');
const CARD_GAP = 16;
const CARD_WIDTH = (width - 40 - CARD_GAP) / 2;

const ILLUSTRATION_MAP: Record<string, any> = {
  choose_topic_meditation_illustration: require('../assets/images/choose_topic_meditation_illustration.png'),
  choose_topic_personal_growth_card: require('../assets/images/choose_topic_personal_growth_card.png'),
  choose_topic_better_focus_card: require('../assets/images/choose_topic_better_focus_card.png'),
  choose_topic_tree_illustration: require('../assets/images/choose_topic_tree_illustration.png'),
  choose_topic_leaf_illustration: require('../assets/images/choose_topic_leaf_illustration.png'),
  choose_topic_person_illustration: require('../assets/images/choose_topic_person_illustration.png'),
  choose_topic_nature_illustration: require('../assets/images/choose_topic_nature_illustration.png'),
};

export default function ChooseTopicScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative wave/circle */}
      <Image
        source={require('../assets/images/choose_topic_decorative_wave.png')}
        style={styles.decorativeWave}
        resizeMode="contain"
      />

      <Text style={styles.heading}>
        <Text style={styles.headingBold}>What Brings you</Text>
        {'\n'}to Silent Moon?
      </Text>
      <Text style={styles.subtitle}>choose a topic to focuse on:</Text>

      <FlatList
        data={TOPICS}
        numColumns={2}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => router.replace('/reminders')}
            style={[
              styles.card,
              { backgroundColor: item.color },
              index % 2 === 1 && { marginTop: 20 },
            ]}
          >
            {item.illustration && ILLUSTRATION_MAP[item.illustration] ? (
              <Image
                source={ILLUSTRATION_MAP[item.illustration]}
                style={styles.cardIllustration}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
            )}
            <Text
              style={[
                styles.cardTitle,
                item.color === '#1F265E' && { color: '#FFFFFF' },
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
    paddingHorizontal: 20,
  },
  decorativeWave: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 180,
    height: 180,
  },
  heading: {
    fontSize: 28,
    color: Colors.textDark,
    marginTop: 20,
    lineHeight: 38,
  },
  headingBold: {
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textGray,
    marginTop: 8,
    marginBottom: 10,
  },
  grid: {
    paddingBottom: 40,
  },
  row: {
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'flex-end',
    marginBottom: CARD_GAP,
    overflow: 'hidden',
  },
  cardIllustration: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  cardEmoji: {
    fontSize: 60,
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    left: CARD_WIDTH / 2 - 30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    zIndex: 1,
  },
});
