import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { generateNoticeSuggestion } from '@/app/actions/notice-suggestion';

export const useCreateNoticeSuggestion = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: generateNoticeSuggestion,
    onError: (error) => {
      console.error(error);

      if (error instanceof Error && error.message === 'RATE_LIMIT') {
        toast({
          title: '오늘의 문구 추천 횟수를 모두 사용했어요.',
          description: '내일 다시 시도해주세요.',
          variant: 'error',
          duration: 5000,
        });
        return;
      }

      toast({
        title: '문구 추천 중 오류가 발생했어요.',
        description: '너무 자주 요청했다면 나중에 다시 시도해주세요.',
        variant: 'error',
        duration: 5000,
      });
    },
  });
};
