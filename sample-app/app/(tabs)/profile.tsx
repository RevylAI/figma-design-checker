import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function ProfileScreen() {
  const stats = [
    { label: 'Sessions', value: '42' },
    { label: 'Minutes', value: '1,230' },
    { label: 'Streak', value: '12 days' },
  ];

  const menuItems = [
    { icon: 'settings-outline', label: 'Settings' },
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'download-outline', label: 'Downloads' },
    { icon: 'help-circle-outline', label: 'Help & Support' },
    { icon: 'log-out-outline', label: 'Log Out' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={Colors.textLight} />
        </View>
        <Text style={styles.name}>Afsar</Text>
        <Text style={styles.email}>imshuvo97@gmail.com</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem}>
            <Ionicons name={item.icon as any} size={22} color={Colors.textDark} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textGray} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: Colors.textGray,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 28,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.divider,
    marginHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textDark,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textGray,
    marginTop: 4,
  },
  menu: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: Colors.textDark,
    marginLeft: 16,
  },
});
