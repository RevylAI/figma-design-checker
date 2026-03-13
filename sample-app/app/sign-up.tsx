import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={Colors.textDark} />
      </TouchableOpacity>

      {/* Decorative background blobs */}
      <Image
        source={require('../assets/images/signup_background_blobs.png')}
        style={styles.backgroundBlobs}
        resizeMode="contain"
      />

      <Text style={styles.heading}>Create your account</Text>

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

      {/* Form fields with mock filled state */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          defaultValue="afsar"
          placeholderTextColor={Colors.textGray}
        />
        <Ionicons name="checkmark" size={22} color="#4CAF50" style={styles.checkIcon} />
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          defaultValue="imshuvo97@gmail.com"
          placeholderTextColor={Colors.textGray}
        />
        <Ionicons name="checkmark" size={22} color="#4CAF50" style={styles.checkIcon} />
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          defaultValue="••••••••"
          secureTextEntry
          placeholderTextColor={Colors.textGray}
        />
        <Ionicons name="eye-off-outline" size={22} color={Colors.textGray} style={styles.checkIcon} />
      </View>

      {/* Privacy policy */}
      <View style={styles.privacyRow}>
        <Text style={styles.privacyText}>i have read the </Text>
        <Text style={styles.privacyLink}>Privace Policy</Text>
        <View style={styles.checkbox} />
      </View>

      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => router.replace('/welcome')}
      >
        <Text style={styles.getStartedText}>GET STARTED</Text>
      </TouchableOpacity>
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
  backgroundBlobs: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 300,
    height: 300,
    opacity: 0.6,
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
  inputRow: {
    width: '100%',
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#F2F3F7',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingRight: 50,
    fontSize: 16,
    color: Colors.textDark,
  },
  checkIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  privacyText: {
    fontSize: 14,
    color: Colors.textGray,
  },
  privacyLink: {
    fontSize: 14,
    color: Colors.primary,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: Colors.textGray,
    borderRadius: 3,
    marginLeft: 'auto',
  },
  getStartedButton: {
    width: '100%',
    height: 63,
    backgroundColor: Colors.primary,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  getStartedText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
    letterSpacing: 1,
  },
});
