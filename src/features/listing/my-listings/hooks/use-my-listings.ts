import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { myListingsKey } from '@/infrastructure/query/query-keys';
import { getMyListing, pauseListing, publishListing } from '@/services/listing.service';

export function useMyListings(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: myListingsKey(),
    queryFn: getMyListing,
    enabled: options?.enabled,
  });
}

export function usePublishListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishListing(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myListingsKey() });
    },
  });
}

export function usePauseListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pauseListing(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myListingsKey() });
    },
  });
}
