import { useQuery } from '@tanstack/react-query';
import { getCharacters } from '../services/firestore';

export const useCharacters = () => {
  return useQuery({
    queryKey: ['characters'],
    queryFn: getCharacters,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}; 