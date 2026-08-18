import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { darkenColor } from '@/utils/color';

interface AuthCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
}

export function AuthCheckbox({ checked, onToggle, label }: AuthCheckboxProps) {
  const theme = useTheme();

  const baseBoxBackground = checked ? theme.primary : theme.surface;

  return (
    <Pressable onPress={onToggle} style={styles.row}>
      {({ pressed }) => (
        <>
          <View
            style={[
              styles.box,
              {
                borderColor: theme.border,
                backgroundColor: pressed ? darkenColor(baseBoxBackground) : baseBoxBackground,
              },
            ]}
          >
            {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
          </View>
          <ThemedText type="small" style={styles.label}>
            {label}
          </ThemedText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flexShrink: 1,
  },
});
