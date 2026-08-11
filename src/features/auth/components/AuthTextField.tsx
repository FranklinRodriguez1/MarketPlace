import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

interface AuthTextFieldProps
  extends Pick<
    TextInputProps,
    'value' | 'onChangeText' | 'placeholder' | 'secureTextEntry' | 'keyboardType' | 'autoCapitalize'
  > {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  error?: string;
  rightElement?: ReactNode;
}

export function AuthTextField({ label, icon, error, rightElement, ...inputProps }: AuthTextFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <View
        style={[
          styles.inputRow,
          { borderColor: error ? theme.danger : theme.border, backgroundColor: theme.surface },
        ]}
      >
        <Ionicons name={icon} size={18} color={theme.textSecondary} />
        <TextInput
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }]}
          {...inputProps}
        />
        {rightElement}
      </View>
      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color={theme.danger} />
          <ThemedText type="small" themeColor="danger">
            {error}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
    gap: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
