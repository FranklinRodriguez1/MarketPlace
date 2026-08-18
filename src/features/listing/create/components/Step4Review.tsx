import { View, Pressable, StyleSheet, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { useCategories } from '../hooks/use-categories';
import type { CreateListingForm } from '../schemas/create-listing.schema';

interface Step4ReviewProps {
  onPublish: () => void;
  loading?: boolean;
}

function formatPrice(t: TFunction, pricing: CreateListingForm['pricing']): { label: string; amount: string } | null {
  if (pricing.model === 'fixed') {
    return { label: t('createListing.review.priceTag'), amount: `${pricing.price.currency} ${(pricing.price.amountMinor / 100).toFixed(2)}` };
  }

  if (pricing.model === 'hourly') {
    return { label: t('createListing.review.perHourTag'), amount: `${pricing.hourlyRate.currency} ${(pricing.hourlyRate.amountMinor / 100).toFixed(2)}` };
  }

  if (pricing.startingFrom) {
    return { label: t('createListing.review.startingFromTag'), amount: `${pricing.startingFrom.currency} ${(pricing.startingFrom.amountMinor / 100).toFixed(2)}` };
  }

  return null;
}

export function Step4Review({onPublish, loading= false}: Step4ReviewProps) {
  const theme = useTheme();
  const { watch } = useFormContext<CreateListingForm>();
  const { data: categories } = useCategories();
  const { t } = useTranslation();

  const title = watch('title');
  const categoryId = watch('categoryId');
  const pricing = watch('pricing');

  const categoryName = categories?.find((category) => category.id === categoryId)?.name ?? '';
  const price = formatPrice(t, pricing);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* TÍTULO */}
      <ThemedText style={styles.title}>
        {t('createListing.review.checkYourAd')}
      </ThemedText>

      <ThemedText themeColor="textSecondary" style={styles.description}>
        {t('createListing.review.previewDescription')}
      </ThemedText>

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
              <ThemedText style={styles.category}>
                {categoryName.toUpperCase()}
              </ThemedText>
            </View>
          )}

          {/* TÍTULO */}
          <ThemedText
            style={styles.serviceTitle}
            numberOfLines={1}
          >
            {title}
          </ThemedText>

          {/* ESTADO */}
          <View style={styles.statusContainer}>
            <MaterialIcons
              name="star"
              size={16}
              color={theme.text}
            />

            <ThemedText style={styles.status}>
              {t('createListing.review.new')}
            </ThemedText>
          </View>

        </View>

        {/* PRECIO */}
        <View style={styles.priceContainer}>

          {price ? (
            <>
              <ThemedText themeColor="textSecondary" style={styles.from}>
                {price.label}
              </ThemedText>

              <ThemedText themeColor="danger" style={styles.price}>
                {price.amount}
              </ThemedText>
            </>
          ) : (
            <ThemedText themeColor="textSecondary" style={styles.from}>
              {t('createListing.review.quoteOnlyTag')}
            </ThemedText>
          )}

        </View>

      </View>

      {/* BOTÓN */}
      <Pressable
        onPress={onPublish}
        disabled={loading}
        style={({ pressed }) => [
          styles.publishButton,
          { backgroundColor: pressed && !loading ? '#0369A1' : theme.primary },
        ]}
      >

        <MaterialIcons
          name="publish"
          size={22}
          color="#FFFFFF"
        />

        <ThemedText style={styles.publishText}>
          {loading ? t('createListing.review.publishing') : t('createListing.review.postAd')}
        </ThemedText>

      </Pressable>

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

    minHeight: 48,

    borderRadius: 8,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,
  },

  publishText: {
    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '600',
  },
});
