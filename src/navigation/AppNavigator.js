import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import TabBar from '../components/TabBar';
import TransactionsScreen from '../screens/TransactionsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import { colors } from '../constants/theme';

// Three sections switched by the bottom tab bar. Only the active screen stays
// mounted, so each one loads fresh data from SQLite when it is opened.
export default function AppNavigator({ user }) {
  const [tab, setTab] = useState('transactions');

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        {tab === 'transactions' ? <TransactionsScreen user={user} /> : null}
        {tab === 'categories' ? <CategoriesScreen user={user} /> : null}
        {tab === 'add' ? (
          <AddExpenseScreen user={user} onCancel={() => setTab('transactions')} />
        ) : null}
      </View>
      <TabBar active={tab} onSelect={setTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
  },
});