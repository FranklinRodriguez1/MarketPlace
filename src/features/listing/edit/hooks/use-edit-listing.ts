import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { listingKey, myListingsKey } from '@/infrastructure/query/query-keys';
import { getListing, updateListing, type UpdateListingInput } from '@/services/listing.service';

export function useListing(id: string) {
  return useQuery({
    queryKey: listingKey(id),
    queryFn: () => getListing(id),
  });
}

export function useUpdateListing(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateListingInput) => updateListing(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myListingsKey() });
      void queryClient.invalidateQueries({ queryKey: listingKey(id) });
    },
  });
}
