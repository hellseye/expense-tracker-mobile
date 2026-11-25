import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import * as expenseController from '../controllers/expenseController';
import Banner from '../components/Banner';
import useCategories from '../hooks/useCategories';
import useMessage from '../hooks/useMessage';
import { colors } from '../constants/theme';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../constants/paymentMethods';
import { today } from '../utils/format';

// Add an expense: title, amount, category, payment method, date (defaults to
// today) and optional notes.
export default function AddExpenseScreen({ user, onCancel }) {
  const { categories } = useCategories(user.id);
  const [message, showMessage] = useMessage();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [date, setDate] = useState(today());
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Preselect the first category once the list has loaded.
  useEffect(() => {
    if (categoryId === null && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setNotes('');
    setPaymentMethod('CREDIT_CARD');
    setDate(today());
    setCategoryId(categories.length > 0 ? categories[0].id : null);
  };

  const save = async () => {
    setSaving(true);

    try {
      await expenseController.createExpense({
        userId: user.id,
        categoryId,
        title,
        amount: Number(amount),
        paymentMethod,
        expenseDate: date,
        notes,
      });

      showMessage('Expense added.', 'success');
      resetForm();
    } catch (error) {
      showMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Add expense</Text>
        <Banner message={message} />

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Dinner with friends"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.chip,
                { borderColor: category.color },
                categoryId === category.id && styles.chipActive,
              ]}
              onPress={() => setCategoryId(category.id)}
              accessibilityRole="button"
            >
              <View style={[styles.dot, { backgroundColor: category.color }]} />
              <Text style={[styles.chipText, categoryId === category.id && styles.chipTextActive]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {categories.length === 0 ? (
          <Text style={styles.hint}>No categories yet. Add one in the Categories tab.</Text>
        ) : null}

        <Text style={styles.label}>Payment method</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method}
              style={[styles.chip, paymentMethod === method && styles.chipActive]}
              onPress={() => setPaymentMethod(method)}
              accessibilityRole="button"
            >
              <Text style={[styles.chipText, paymentMethod === method && styles.chipTextActive]}>
                {PAYMENT_METHOD_LABELS[method]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="Add a note"
          placeholderTextColor={colors.textMuted}
        />

        <TouchableOpacity style={styles.button} onPress={save} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save expense'}</Text>
        </TouchableOpacity>

        {onCancel ? (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 14,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chips: {
    paddingBottom: 6,
    marginBottom: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  chipTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});