import { createLink } from '@/apis/link/linkRequest';
import { useMutation } from '@tanstack/react-query';

export const useCreateLink = () => {
  return useMutation({
    mutationFn: createLink,
  });
};
