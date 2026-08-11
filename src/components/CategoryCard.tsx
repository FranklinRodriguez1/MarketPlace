import { View, Text, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface CategoryCardProps {
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  selected?: boolean;
  onPress: () => void;
}

export function CategoryCard({
  name,
  icon,
  selected = false,
  onPress,
}: CategoryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: '48%',
        padding: 20,
        borderRadius: 12,
        backgroundColor: selected ? '#E0F2FE' : '#FFF',
        borderWidth: 1,
        borderColor: selected ? '#0284C7' : '#E5E7EB',
      }}
    >
      <MaterialIcons
        name={icon}
        size={28}
        color={selected ? '#0284C7' : '#000'}
      />

      <Text>{name}</Text>
    </Pressable>
  );
}