import { createLinkCode } from '@/apis/link/linkRequest';
import { useMutation } from '@tanstack/react-query';

export const useCreateLinkCode = () => {
  return useMutation({
    mutationFn: createLinkCode,
  });
};
