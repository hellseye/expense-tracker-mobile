import { StyleSheet, Text, FlatList, View } from 'react-native';

import TransactionItem from '../components/TransactionItem';
import EmptyState from '../components/EmptyState';
import Banner from '../components/Banner';
import useTransactions from '../hooks/useTransactions';
import useCategories from '../hooks/useCategories';
import { colors } from '../constants/theme';

// Transactions list, newest first.
export default function TransactionsScreen({ user }) {
  const { transactions, loading, error } = useTransactions(user.id);
  const { categories } = useCategories(user.id);

  const categoryById = {};
  for (const category of categories) {
    categoryById[category.id] = category;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transactions</Text>
      <Banner message={error ? { text: error, type: 'error' } : null} />
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            category={categoryById[item.category_id]}
            currency={user.currency}
          />
        )}
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              title="No transactions yet"
              subtitle="Add your first expense from the Add Expense tab."
            />
          )
        }
        contentContainerStyle={
          transactions.length === 0 ? styles.emptyList : styles.list
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  list: {
    paddingBottom: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});