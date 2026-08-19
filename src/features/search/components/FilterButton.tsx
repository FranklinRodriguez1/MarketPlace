import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface FilterButtonProps {
  active?: boolean;
  onPress: () => void;
}

export function FilterButton({ active, onPress }: FilterButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        { borderColor: theme.border, backgroundColor: active ? theme.backgroundSelected : theme.background },
      ]}
    >
      <Ionicons name="options-outline" size={20} color={active ? theme.primary : theme.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.input,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
