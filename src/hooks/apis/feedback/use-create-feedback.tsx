import { createFeedback } from '@/apis/feedback/feedbackRequest';
import { useMutation } from '@tanstack/react-query';

export const useCreateFeedback = () => {
  return useMutation({
    mutationFn: createFeedback,
  });
};
