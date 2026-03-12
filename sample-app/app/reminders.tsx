import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { DAYS } from '../constants/Data';

const { width } = Dimensions.get('window');

const HOURS = ['8', '9', '10', '11', '12', '1', '2'];
const MINUTES = ['27', '28', '29', '30', '31', '32', '33'];
const PERIODS = ['AM', 'PM'];

export default function RemindersScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>
        <Text style={styles.headingBold}>What time would you</Text>
        {'\n'}
        <Text style={styles.headingBold}>like to meditate?</Text>
      </Text>
      <Text style={styles.subtitle}>
        Any time you can choose but We recommend{'\n'}first thing in th morning.
      </Text>

      {/* Time picker */}
      <View style={styles.pickerContainer}>
        <View style={styles.selectedRow} />
        <View style={styles.pickerColumns}>
          {/* Hours */}
          <View style={styles.pickerColumn}>
            {HOURS.map((h, i) => (
              <Text
                key={`h-${i}`}
                style={[
                  styles.pickerItem,
                  i === 3 && styles.pickerItemSelected,
                  (i < 2 || i > 4) && styles.pickerItemFaded,
                ]}
              >
                {h}
              </Text>
            ))}
          </View>
          {/* Minutes */}
          <View style={styles.pickerColumn}>
            {MINUTES.map((m, i) => (
              <Text
                key={`m-${i}`}
                style={[
                  styles.pickerItem,
                  i === 3 && styles.pickerItemSelected,
                  (i < 2 || i > 4) && styles.pickerItemFaded,
                ]}
              >
                {m}
              </Text>
            ))}
          </View>
          {/* AM/PM */}
          <View style={styles.pickerColumn}>
            {['', '', '', 'AM', 'PM', '', ''].map((p, i) => (
              <Text
                key={`p-${i}`}
                style={[
                  styles.pickerItem,
                  i === 3 && styles.pickerItemSelected,
                  i === 4 && styles.pickerItemLight,
                  !p && styles.pickerItemHidden,
                ]}
              >
                {p || ' '}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* Day selection */}
      <Text style={styles.dayHeading}>
        <Text style={styles.headingBold}>Which day would you</Text>
        {'\n'}
        <Text style={styles.headingBold}>like to meditate?</Text>
      </Text>
      <Text style={styles.daySubtitle}>
        Everyday is best, but we recommend picking{'\n'}at least five.
      </Text>

      <View style={styles.daysRow}>
        {DAYS.map((day, i) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayCircle,
              i < 4 && styles.daySelected,
              i === 6 && styles.daySelected,
            ]}
          >
            <Text
              style={[
                styles.dayText,
                (i < 4 || i === 6) && styles.dayTextSelected,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.saveText}>SAVE</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.noThanksText}>NO THANKS</Text>
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
  heading: {
    fontSize: 24,
    color: Colors.textDark,
    marginTop: 40,
    lineHeight: 34,
  },
  headingBold: {
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textGray,
    marginTop: 12,
    lineHeight: 22,
  },
  pickerContainer: {
    backgroundColor: Colors.inputBg,
    borderRadius: 20,
    marginTop: 24,
    paddingVertical: 10,
    height: 200,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  selectedRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 36,
    top: '50%',
    marginTop: -18,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
  },
  pickerColumns: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  pickerColumn: {
    alignItems: 'center',
  },
  pickerItem: {
    fontSize: 20,
    color: Colors.textGray,
    height: 28,
    lineHeight: 28,
  },
  pickerItemSelected: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textDark,
  },
  pickerItemLight: {
    color: Colors.textGray,
  },
  pickerItemFaded: {
    opacity: 0.3,
  },
  pickerItemHidden: {
    opacity: 0,
  },
  dayHeading: {
    fontSize: 24,
    color: Colors.textDark,
    marginTop: 32,
    lineHeight: 34,
  },
  daySubtitle: {
    fontSize: 16,
    color: Colors.textGray,
    marginTop: 12,
    lineHeight: 22,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  dayCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.backgroundWhite,
    borderWidth: 1,
    borderColor: Colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daySelected: {
    backgroundColor: Colors.textDark,
    borderColor: Colors.textDark,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textGray,
  },
  dayTextSelected: {
    color: Colors.textLight,
  },
  saveButton: {
    width: '100%',
    height: 63,
    backgroundColor: Colors.primary,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
    letterSpacing: 1,
  },
  noThanksText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 0.5,
  },
});
