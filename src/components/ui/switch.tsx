import { Switch as RNSwitch, Platform } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Switch({ value, onValueChange, disabled }: SwitchProps) {
  const theme = useTheme();

  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: theme.border, true: theme.primary }}
      thumbColor={Platform.OS === 'android' ? theme.surface : undefined}
    />
  );
}
