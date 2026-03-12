import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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

        {/* Daily Calm banner */}
        <TouchableOpacity style={styles.dailyBanner}>
          <LinearGradient
            colors={['#FFC97E', '#F8B566']}
            style={styles.dailyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.dailyWave} />
            <View>
              <Text style={styles.dailyTitle}>Daily Calm</Text>
              <Text style={styles.dailySub}>APR 30  •  PAUSE PRACTICE</Text>
            </View>
            <View style={styles.dailyPlayBtn}>
              <Ionicons name="play" size={16} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Meditation grid */}
        <View style={styles.gridRow}>
          {/* 7 Days of Calm */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/course-details')}
          >
            <LinearGradient
              colors={['#8E97FD', '#A5AEF7']}
              style={styles.gridImage}
            >
              <View style={styles.gridBlob1} />
              <View style={styles.gridBlob2} />
            </LinearGradient>
            <Text style={styles.gridTitle}>7 Days of Calm</Text>
          </TouchableOpacity>

          {/* Anxiet Release */}
          <TouchableOpacity style={styles.gridCard}>
            <LinearGradient
              colors={['#F8A959', '#FAC480']}
              style={styles.gridImage}
            >
              <View style={styles.gridTree} />
              <View style={styles.gridSun} />
            </LinearGradient>
            <Text style={styles.gridTitle}>Anxiet Release</Text>
          </TouchableOpacity>
        </View>

        {/* Second row */}
        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.gridCard}>
            <LinearGradient
              colors={['#A0E4CB', '#7DD4B5']}
              style={styles.gridImage}
            >
              <View style={styles.gridBlob1} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard}>
            <LinearGradient
              colors={['#F09EA1', '#E88C8F']}
              style={styles.gridImage}
            >
              <View style={styles.gridBlob2} />
            </LinearGradient>
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
  },
  dailyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    height: 90,
    position: 'relative',
    overflow: 'hidden',
  },
  dailyWave: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 150,
    height: 60,
    backgroundColor: 'rgba(255,100,100,0.3)',
    borderTopLeftRadius: 80,
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
  },
  dailySub: {
    fontSize: 11,
    color: 'rgba(63,65,78,0.6)',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  dailyPlayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.textDark,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3,
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
  gridImage: {
    width: '100%',
    height: CARD_WIDTH * 0.95,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  gridBlob1: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  gridBlob2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    position: 'absolute',
    top: 15,
    right: 20,
  },
  gridTree: {
    width: 8,
    height: 50,
    backgroundColor: '#8B4513',
    borderRadius: 4,
    position: 'absolute',
    right: 40,
    bottom: 20,
  },
  gridSun: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
    position: 'absolute',
    left: 20,
    top: 15,
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
