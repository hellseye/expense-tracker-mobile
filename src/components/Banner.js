import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';

// Success / error feedback banner.
export default function Banner({ message }) {
  if (!message) {
    return null;
  }

  const isError = message.type !== 'success';

  return (
    <View style={[styles.container, isError ? styles.error : styles.success]}>
      <Text style={styles.text}>{message.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  success: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  text: {
    color: colors.text,
    fontSize: 14,
  },
});