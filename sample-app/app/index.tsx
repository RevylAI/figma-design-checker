import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        <Image
          source={require('../assets/images/signin_city_illustration.png')}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
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
    backgroundColor: '#F5F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationImage: {
    width: width,
    height: '100%',
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
