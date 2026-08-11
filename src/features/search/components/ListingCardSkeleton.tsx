import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function ListingCardSkeleton() {
  const theme = useTheme();
  const block = { backgroundColor: theme.backgroundElement };

  return (
    <View style={[styles.card, { backgroundColor: theme.background, borderColor: theme.border }]}>
      <View style={[styles.image, block]} />
      <View style={styles.body}>
        <View style={[styles.line, block, { width: '80%' }]} />
        <View style={[styles.line, block, { width: '60%' }]} />
        <View style={styles.tagsRow}>
          <View style={[styles.tag, block]} />
          <View style={[styles.tag, block, { width: 60 }]} />
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <View style={styles.price}>
        <View style={[styles.line, block, { width: 56, height: 16 }]} />
        <View style={[styles.line, block, { width: 40, height: 12, marginTop: 8 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 12,
  },
  body: {
    flex: 1,
    gap: 8,
  },
  line: {
    height: 12,
    borderRadius: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    width: 44,
    height: 12,
    borderRadius: 6,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
  },
  price: {
    justifyContent: 'center',
    minWidth: 60,
  },
});
