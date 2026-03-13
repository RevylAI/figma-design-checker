import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#8E97FD', '#8588E8']} style={styles.container}>
      {/* Logo */}
      <View style={styles.logoRow}>
        <Text style={styles.logoText}>S i l e n t</Text>
        <View style={styles.logoIcon}>
          <View style={styles.logoShape} />
        </View>
        <Text style={styles.logoText}>M o o n</Text>
      </View>

      {/* Greeting */}
      <Text style={styles.heading}>
        <Text style={styles.headingBold}>Hi Afsar, Welcome</Text>
        {'\n'}to Silent Moon
      </Text>

      <Text style={styles.subtitle}>
        Explore the app, Find some peace of mind to{'\n'}prepare for meditation.
      </Text>

      {/* Illustration area - meditation person */}
      <View style={styles.illustrationArea}>
        {/* Clouds */}
        <View style={[styles.cloud, { left: 10, top: 0 }]}>
          <View style={styles.cloudBody} />
        </View>
        <View style={[styles.cloud, { right: 0, top: 60 }]}>
          <View style={[styles.cloudBody, { width: 80, height: 30 }]} />
        </View>

        {/* Semicircle behind person */}
        <View style={styles.semicircle} />

        {/* Person meditating */}
        <Image
          source={require('../assets/images/welcome_yoga_illustration.png')}
          style={styles.yogaIllustration}
          resizeMode="contain"
        />
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/choose-topic')}
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
    paddingTop: 60,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E6DEFF',
    letterSpacing: 2,
  },
  logoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoShape: {
    width: 10,
    height: 7,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 30,
    color: '#FFECCC',
    textAlign: 'center',
    marginTop: 40,
    lineHeight: 40,
  },
  headingBold: {
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(235,235,245,0.7)',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  illustrationArea: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cloud: {
    position: 'absolute',
  },
  cloudBody: {
    width: 60,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  semicircle: {
    width: 280,
    height: 140,
    borderTopLeftRadius: 140,
    borderTopRightRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.08)',
    position: 'absolute',
    bottom: 40,
  },
  yogaIllustration: {
    width: 280,
    height: 280,
    position: 'absolute',
    bottom: 20,
  },
  button: {
    width: width - 80,
    height: 63,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    letterSpacing: 1,
  },
});
