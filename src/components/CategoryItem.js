import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../constants/theme';

// One row in the categories list.
export default function CategoryItem({ category, onDelete }) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: category.color }]} />
      <View style={styles.details}>
        <Text style={styles.name}>{category.name}</Text>
        <Text style={styles.subtitle}>{category.icon}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deleteText: {
    color: colors.danger,
    fontSize: 13,
  },
});