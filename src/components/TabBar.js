import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../constants/theme';

const TABS = [
  { key: 'transactions', label: 'Transactions' },
  { key: 'categories', label: 'Categories' },
  { key: 'add', label: 'Add Expense' },
];

export default function TabBar({ active, onSelect }) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onSelect(tab.key)}
          accessibilityRole="button"
        >
          <Text style={[styles.label, active === tab.key && styles.labelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});