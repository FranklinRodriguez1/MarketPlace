import { View, Text, StyleSheet, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { useCategories } from '../hooks/use-categories';
import type { CreateListingForm } from '../schemas/create-listing.schema';

interface Step4ReviewProps {
  onPublish: () => void;
  loading?: boolean;
}

function formatPrice(pricing: CreateListingForm['pricing']): { label: string; amount: string } | null {
  if (pricing.model === 'fixed') {
    return { label: 'PRECIO', amount: `${pricing.price.currency} ${(pricing.price.amountMinor / 100).toFixed(2)}` };
  }

  if (pricing.model === 'hourly') {
    return { label: 'POR HORA', amount: `${pricing.hourlyRate.currency} ${(pricing.hourlyRate.amountMinor / 100).toFixed(2)}` };
  }

  if (pricing.startingFrom) {
    return { label: 'DESDE', amount: `${pricing.startingFrom.currency} ${(pricing.startingFrom.amountMinor / 100).toFixed(2)}` };
  }

  return null;
}

export function Step4Review({onPublish, loading= false}: Step4ReviewProps) {
  const theme = useTheme();
  const { watch } = useFormContext<CreateListingForm>();
  const { data: categories } = useCategories();

  const title = watch('title');
  const categoryId = watch('categoryId');
  const pricing = watch('pricing');

  const categoryName = categories?.find((category) => category.id === categoryId)?.name ?? '';
  const price = formatPrice(pricing);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* TÍTULO */}
      <Text style={[styles.title, { color: theme.text }]}>
        Check your ad
      </Text>

      <Text style={[styles.description, { color: theme.textSecondary }]}>
        This is how users will see your service listed on the bulletin board
      </Text>

      {/* TARJETA DE PREVISUALIZACIÓN */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>

        {/* IMAGEN */}
        <Image
          style={styles.image}
          source={{
            uri: 'https://i.pinimg.com/originals/58/ff/0f/58ff0ff4b5df051295951e9459ad47d9.jpg?nii=t',
          }}
        />

        {/* INFORMACIÓN */}
        <View style={[styles.info, { borderRightColor: theme.border }]}>

          {/* CATEGORÍA */}
          {categoryName !== '' && (
            <View style={[styles.categoryContainer, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <Text style={[styles.category, { color: theme.textSecondary }]}>
                {categoryName.toUpperCase()}
              </Text>
            </View>
          )}

          {/* TÍTULO */}
          <Text
            style={[styles.serviceTitle, { color: theme.text }]}
            numberOfLines={1}
          >
            {title}
          </Text>

          {/* ESTADO */}
          <View style={styles.statusContainer}>
            <MaterialIcons
              name="star"
              size={16}
              color={theme.text}
            />

            <Text style={[styles.status, { color: theme.text }]}>
              Nuevo
            </Text>
          </View>

        </View>

        {/* PRECIO */}
        <View style={styles.priceContainer}>

          {price ? (
            <>
              <Text style={[styles.from, { color: theme.textSecondary }]}>
                {price.label}
              </Text>

              <Text style={[styles.price, { color: theme.danger }]}>
                {price.amount}
              </Text>
            </>
          ) : (
            <Text style={[styles.from, { color: theme.textSecondary }]}>
              A COTIZAR
            </Text>
          )}

        </View>

      </View>

      {/* BOTÓN */}
      <Button
        label={loading ? 'Publishing...' : 'Post an ad'}
        onPress={onPublish}
        loading={loading}
        variant="primary"
        style={styles.publishButton}
        icon={(color) => <MaterialIcons name="publish" size={22} color={color} />}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  description: {
    fontSize: 14,
    marginBottom: 20,
  },

  // TARJETA
  card: {
    width: '100%',
    height: 105,

    flexDirection: 'row',

    borderWidth: 1,

    borderRadius: BorderRadius.card,

    overflow: 'hidden',

    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  // IMAGEN
  image: {
    width: 90,
    height: '100%',
  },

  // INFORMACIÓN
  info: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,

    justifyContent: 'center',

    borderRightWidth: 1,
  },

  categoryContainer: {
    alignSelf: 'flex-start',

    borderWidth: 1,

    borderRadius: BorderRadius.input,

    paddingHorizontal: 8,
    paddingVertical: 2,

    marginBottom: 5,
  },

  category: {
    fontSize: 10,
    fontWeight: '500',
  },

  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',

    marginBottom: 4,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  status: {
    fontSize: 12,
    fontWeight: '500',
  },

  // PRECIO
  priceContainer: {
    width: 78,

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 6,
  },

  from: {
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: '500',

    marginBottom: 2,
  },

  price: {
    fontSize: 22,
    fontWeight: '700',
  },

  // BOTÓN
  publishButton: {
    marginTop: 20,
  },
});
