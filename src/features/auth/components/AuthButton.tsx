import { Button, type ButtonVariant } from '@/components/ui/button';

interface AuthButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Extract<ButtonVariant, 'primary' | 'outlined'>;
  loading?: boolean;
  disabled?: boolean;
}

export function AuthButton({ label, onPress, variant = 'primary', loading, disabled }: AuthButtonProps) {
  return <Button label={label} onPress={onPress} variant={variant} loading={loading} disabled={disabled} />;
}
