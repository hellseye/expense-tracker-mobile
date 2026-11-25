import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import * as categoryController from '../controllers/categoryController';
import CategoryItem from '../components/CategoryItem';
import EmptyState from '../components/EmptyState';
import Banner from '../components/Banner';
import useCategories from '../hooks/useCategories';
import useMessage from '../hooks/useMessage';
import { colors, CATEGORY_COLORS, CATEGORY_ICONS } from '../constants/theme';

// Category management: add a category (name, colour, icon) and delete the ones
// that are not used by any transaction.
export default function CategoriesScreen({ user }) {
  const { categories, loading, error, reload } = useCategories(user.id);
  const [message, showMessage] = useMessage();

  const [name, setName] = useState('');
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
  const [icon, setIcon] = useState(CATEGORY_ICONS[0]);
  const [saving, setSaving] = useState(false);

  const addCategory = async () => {
    setSaving(true);

    try {
      await categoryController.createCategory({ userId: user.id, name, color, icon });
      showMessage('Category added.', 'success');
      setName('');
      await reload();
    } catch (err) {
      showMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = (category) => {
    Alert.alert('Delete category', `Delete "${category.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await categoryController.deleteCategory(category.id, user.id);
            showMessage('Category deleted.', 'success');
            await reload();
          } catch (err) {
            showMessage(err.message);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>Categories</Text>
      <Banner message={message || (error ? { text: error, type: 'error' } : null)} />

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Groceries"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Colour</Text>
        <View style={styles.swatches}>
          {CATEGORY_COLORS.map((swatch) => (
            <TouchableOpacity
              key={swatch}
              style={[
                styles.swatch,
                { backgroundColor: swatch },
                color === swatch && styles.swatchActive,
              ]}
              onPress={() => setColor(swatch)}
              accessibilityRole="button"
            />
          ))}
        </View>

        <Text style={styles.label}>Icon</Text>
        <View style={styles.icons}>
          {CATEGORY_ICONS.map((iconName) => (
            <TouchableOpacity
              key={iconName}
              style={[styles.iconChip, icon === iconName && styles.iconChipActive]}
              onPress={() => setIcon(iconName)}
              accessibilityRole="button"
            >
              <Text
                style={[styles.iconText, icon === iconName && styles.iconTextActive]}
              >
                {iconName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={addCategory} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? 'Adding...' : 'Add category'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        {categories.length} {categories.length === 1 ? 'category' : 'categories'}
      </Text>

      {categories.length === 0 && !loading ? (
        <EmptyState title="No categories yet" subtitle="Add your first category above." />
      ) : (
        categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            onDelete={() => deleteCategory(category)}
          />
        ))
      )}
    </ScrollView>
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
  form: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    color: colors.text,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 14,
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 8,
  },
  swatchActive: {
    borderWidth: 3,
    borderColor: colors.text,
  },
  icons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  iconChip: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  iconChipActive: {
    backgroundColor: colors.primary,
  },
  iconText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  iconTextActive: {
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 10,
  },
});