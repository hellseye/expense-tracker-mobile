import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';
import { formatAmount, formatDate } from '../utils/format';

// One row in the transactions list.
export default function TransactionItem({ transaction, category, currency }) {
  const isIncome = transaction.type === 'INCOME';

  return (
    <View style={styles.row}>
      <View
        style={[styles.dot, { backgroundColor: category ? category.color : colors.border }]}
      />
      <View style={styles.details}>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text style={styles.subtitle}>
          {category ? category.name : 'Uncategorised'} · {formatDate(transaction.expense_date)}
        </Text>
      </View>
      <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
        {isIncome ? '+' : '-'}
        {formatAmount(transaction.amount, currency)}
      </Text>
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
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
  },
  expense: {
    color: colors.text,
  },
  income: {
    color: colors.success,
  },
});