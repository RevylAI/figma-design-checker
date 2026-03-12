import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoRow}>
        <Text style={styles.logoText}>Silent</Text>
        <View style={styles.logoIcon}>
          <View style={styles.logoShape} />
        </View>
        <Text style={styles.logoText}>Moon</Text>
      </View>

      {/* Illustration area */}
      <View style={styles.illustrationArea}>
        <LinearGradient
          colors={['#F0ECFF', '#E8E4F8', '#DDD8F0']}
          style={styles.illustrationBg}
        >
          {/* Lamp */}
          <View style={styles.lampBase}>
            <View style={styles.lampShade} />
            <View style={styles.lampStand} />
          </View>
          {/* Couch */}
          <View style={styles.couch}>
            <View style={styles.couchBack} />
            <View style={styles.couchSeat} />
          </View>
          {/* Plant */}
          <View style={styles.plant}>
            <View style={styles.leaf} />
            <View style={[styles.leaf, { transform: [{ rotate: '30deg' }] }]} />
            <View style={[styles.leaf, { transform: [{ rotate: '-30deg' }] }]} />
          </View>
          {/* Person silhouette */}
          <View style={styles.person}>
            <View style={styles.personHead} />
            <View style={styles.personBody} />
          </View>
        </LinearGradient>
      </View>

      {/* Text */}
      <Text style={styles.heading}>We are what we do</Text>
      <Text style={styles.subtitle}>
        Thousand of people are using silent moon{'\n'}for smalls meditation
      </Text>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => router.push('/sign-up')}
      >
        <Text style={styles.signUpText}>SIGN UP</Text>
      </TouchableOpacity>

      <View style={styles.loginRow}>
        <Text style={styles.loginLabel}>ALREADY HAVE AN ACCOUNT? </Text>
        <TouchableOpacity onPress={() => router.push('/sign-in')}>
          <Text style={styles.loginLink}>LOG IN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    letterSpacing: 4,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoShape: {
    width: 12,
    height: 8,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  illustrationArea: {
    width: width,
    height: height * 0.38,
    marginTop: 10,
  },
  illustrationBg: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  lampBase: {
    position: 'absolute',
    left: 50,
    bottom: 60,
    alignItems: 'center',
  },
  lampShade: {
    width: 40,
    height: 50,
    backgroundColor: '#F5DEB3',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  lampStand: {
    width: 4,
    height: 80,
    backgroundColor: '#D4C4A0',
  },
  couch: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  couchBack: {
    width: 160,
    height: 70,
    backgroundColor: '#7B7CC4',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  couchSeat: {
    width: 180,
    height: 40,
    backgroundColor: '#6B6CB4',
    borderRadius: 10,
    marginTop: -5,
  },
  plant: {
    position: 'absolute',
    left: 60,
    bottom: 30,
    alignItems: 'center',
  },
  leaf: {
    width: 20,
    height: 35,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
  },
  person: {
    position: 'absolute',
    bottom: 55,
    alignItems: 'center',
  },
  personHead: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5DEB3',
  },
  personBody: {
    width: 60,
    height: 40,
    backgroundColor: '#D4E4F7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -5,
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textGray,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  signUpButton: {
    width: width - 80,
    height: 63,
    backgroundColor: Colors.primary,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
    letterSpacing: 1,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  loginLabel: {
    fontSize: 14,
    color: Colors.textGray,
    letterSpacing: 0.5,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
});
