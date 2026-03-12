import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

export default function SignInScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={Colors.textDark} />
      </TouchableOpacity>

      {/* Decorative curves */}
      <View style={styles.curve1} />
      <View style={styles.curve2} />

      <Text style={styles.heading}>Welcome Back!</Text>

      {/* Social buttons */}
      <TouchableOpacity style={styles.facebookButton}>
        <Ionicons name="logo-facebook" size={22} color="#FFFFFF" />
        <Text style={styles.facebookText}>CONTINUE WITH FACEBOOK</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleIcon}>G</Text>
        <Text style={styles.googleText}>CONTINUE WITH GOOGLE</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR LOG IN WITH EMAIL</Text>

      {/* Form */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor={Colors.textGray}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.textGray}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.replace('/welcome')}
      >
        <Text style={styles.loginText}>LOG IN</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Bottom link */}
      <View style={styles.bottomRow}>
        <Text style={styles.bottomLabel}>ALREADY HAVE AN ACCOUNT? </Text>
        <TouchableOpacity onPress={() => router.push('/sign-up')}>
          <Text style={styles.bottomLink}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: Colors.backgroundWhite,
    borderWidth: 1,
    borderColor: Colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  curve1: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F5F5F0',
  },
  curve2: {
    position: 'absolute',
    top: -20,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#F5F5F0',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  facebookButton: {
    width: '100%',
    height: 57,
    backgroundColor: Colors.primary,
    borderRadius: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  facebookText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
  googleButton: {
    width: '100%',
    height: 57,
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: Colors.divider,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EA4335',
  },
  googleText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textDark,
    letterSpacing: 0.5,
  },
  orText: {
    fontSize: 14,
    color: Colors.textGray,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.inputBg,
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: Colors.textDark,
  },
  loginButton: {
    width: '100%',
    height: 57,
    backgroundColor: Colors.primary,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
    letterSpacing: 1,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  bottomLabel: {
    fontSize: 14,
    color: Colors.textGray,
    letterSpacing: 0.5,
  },
  bottomLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
});
