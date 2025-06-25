import { getLinks } from '@/apis/link/linkRequest';
import { useQuery } from '@tanstack/react-query';

export const useGetLinks = (linkCode: string) => {
  return useQuery({
    queryKey: ['link-list', linkCode],
    queryFn: () => getLinks({ code: linkCode }),
  });
};
