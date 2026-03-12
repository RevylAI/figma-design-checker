import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function WelcomeSleepScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#03174C', '#0A1F5C', '#122A6B']} style={styles.container}>
      <StatusBar style="light" />

      {/* Stars */}
      <View style={[styles.star, { top: 60, left: 30 }]} />
      <View style={[styles.star, { top: 80, right: 80 }]} />
      <View style={[styles.starSmall, { top: 100, left: 60 }]} />
      <View style={[styles.starSmall, { top: 120, right: 40 }]} />
      <View style={[styles.star, { top: 140, right: 100 }]} />

      {/* Moon */}
      <View style={styles.moonContainer}>
        <View style={styles.moon} />
        <View style={styles.moonShadow} />
      </View>

      {/* Clouds */}
      <View style={[styles.cloud, { top: 80, left: -20 }]} />
      <View style={[styles.cloudSmall, { top: 110, right: 30 }]} />

      {/* Title */}
      <Text style={styles.title}>Wecome to Sleep</Text>
      <Text style={styles.subtitle}>
        Explore the new king of sleep. It uses sound{'\n'}and vesualization to create perfect conditions{'\n'}for refreshing sleep.
      </Text>

      {/* Bird illustration area */}
      <View style={styles.illustrationArea}>
        {/* Branch */}
        <View style={styles.branch} />
        {/* Birds */}
        <View style={[styles.bird, { left: width * 0.3 }]}>
          <View style={[styles.birdBody, { backgroundColor: '#A8E6CF' }]} />
          <View style={styles.birdHead} />
          <View style={styles.birdHat} />
        </View>
        <View style={[styles.bird, { left: width * 0.5 }]}>
          <View style={[styles.birdBody, { backgroundColor: '#F8BBD0' }]} />
          <View style={styles.birdHead} />
          <View style={styles.birdHat} />
        </View>
        {/* ZZZ */}
        <Text style={styles.zzz}>z·Z·Z</Text>
        {/* Leaves */}
        <View style={[styles.leaf, { left: width * 0.15, bottom: -10 }]} />
        <View style={[styles.leaf, { left: width * 0.25, bottom: -15 }]} />
        <View style={[styles.leaf, { right: width * 0.15, bottom: -10 }]} />
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/sleep-music')}
      >
        <Text style={styles.buttonText}>GET STARTED</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  star: {
    position: 'absolute',
    width: 5,
    height: 5,
    backgroundColor: '#E8E8F0',
    borderRadius: 3,
  },
  starSmall: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#B0B0C0',
    borderRadius: 2,
  },
  moonContainer: {
    marginTop: 50,
    position: 'relative',
  },
  moon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8E8F0',
  },
  moonShadow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0A1F5C',
    position: 'absolute',
    top: -5,
    left: 12,
  },
  cloud: {
    position: 'absolute',
    width: 80,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(100,120,160,0.3)',
  },
  cloudSmall: {
    position: 'absolute',
    width: 50,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(100,120,160,0.2)',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(235,235,245,0.6)',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 26,
  },
  illustrationArea: {
    flex: 1,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  branch: {
    width: width * 0.6,
    height: 6,
    backgroundColor: 'rgba(180,160,200,0.4)',
    borderRadius: 3,
    position: 'absolute',
    bottom: '35%',
    transform: [{ rotate: '-5deg' }],
  },
  bird: {
    position: 'absolute',
    bottom: '38%',
    alignItems: 'center',
  },
  birdBody: {
    width: 50,
    height: 45,
    borderRadius: 25,
  },
  birdHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3F414E',
    position: 'absolute',
    top: 12,
  },
  birdHat: {
    width: 20,
    height: 12,
    backgroundColor: '#F05D48',
    borderRadius: 4,
    position: 'absolute',
    top: -8,
  },
  zzz: {
    position: 'absolute',
    top: '25%',
    right: width * 0.25,
    fontSize: 16,
    color: '#FFC97E',
    fontStyle: 'italic',
  },
  leaf: {
    position: 'absolute',
    width: 14,
    height: 22,
    backgroundColor: '#A8E6CF',
    borderRadius: 7,
    transform: [{ rotate: '30deg' }],
  },
  button: {
    width: width - 80,
    height: 63,
    backgroundColor: 'rgba(142,151,253,0.8)',
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
    letterSpacing: 1,
  },
});
