import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { COURSE_TRACKS } from '../constants/Data';

const { width } = Dimensions.get('window');

export default function CourseDetailsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Hero image area */}
      <View style={styles.hero}>
        <Image
          source={require('../assets/images/course_header_illustration.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textDark} />
        </TouchableOpacity>

        {/* Action buttons */}
        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.heroActionBtn}>
            <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroActionBtn}>
            <Ionicons name="download-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Happy Morning</Text>
        <Text style={styles.courseLabel}>COURSE</Text>
        <Text style={styles.description}>
          Ease the mind into a restful night's sleep  with{'\n'}these deep, amblent tones.
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={16} color={Colors.heartPink} />
            <Text style={styles.statText}>24.234 Favorits</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="headset" size={16} color={Colors.primary} />
            <Text style={styles.statText}>34.234 Lestening</Text>
          </View>
        </View>

        {/* Narrator section */}
        <Text style={styles.narratorTitle}>Pick a Nnrrator</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity style={styles.tabActive}>
            <Text style={styles.tabActiveText}>MALE VOICE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabInactive}>
            <Text style={styles.tabInactiveText}>FEMALE VOICE</Text>
          </TouchableOpacity>
        </View>

        {/* Track list */}
        {COURSE_TRACKS.map((track, i) => (
          <TouchableOpacity
            key={track.id}
            style={styles.trackRow}
            onPress={() => router.push('/player')}
          >
            <View style={styles.trackPlayBtn}>
              <Ionicons name="play" size={16} color={Colors.primary} />
            </View>
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>{track.title}</Text>
              <Text style={styles.trackDuration}>{track.duration}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
  },
  hero: {
    height: 300,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  heroActions: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    gap: 10,
    zIndex: 10,
  },
  heroActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(60,60,80,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.textDark,
  },
  courseLabel: {
    fontSize: 12,
    color: Colors.textGray,
    letterSpacing: 1,
    marginTop: 6,
  },
  description: {
    fontSize: 16,
    color: Colors.textGray,
    marginTop: 16,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: Colors.textGray,
  },
  narratorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: 28,
  },
  tabRow: {
    flexDirection: 'row',
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  tabActive: {
    paddingBottom: 12,
    marginRight: 32,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabActiveText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  tabInactive: {
    paddingBottom: 12,
  },
  tabInactiveText: {
    fontSize: 14,
    color: Colors.textGray,
    letterSpacing: 0.5,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  trackPlayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 2,
  },
  trackInfo: {
    marginLeft: 16,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  trackDuration: {
    fontSize: 12,
    color: Colors.textGray,
    marginTop: 4,
  },
});
