import { useLocalSearchParams } from 'expo-router';

import { EditListingScreen } from '@/features/listing/edit/EditListingScreen';

export default function EditListingPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <EditListingScreen id={id} />;
}
