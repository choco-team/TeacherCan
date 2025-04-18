import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { generateNoticeSuggestion } from '@/app/actions/notice-suggestion';
import { parseOpenAIResponse } from '@/containers/notice-suggestion/notice-suggestion.utils';
import type {
  NoticeSuggestion,
  NoticeSuggestionRequest,
} from '@/containers/notice-suggestion/notice-suggestion.types';
import { NOTICE_SUGGESTION_ERROR_CODES } from '@/containers/notice-suggestion/notice-suggestion.constants';

export const useCreateNoticeSuggestion = () => {
  const { toast } = useToast();

  return useMutation<NoticeSuggestion[], Error, NoticeSuggestionRequest>({
    mutationFn: async (request) => {
      const data = await generateNoticeSuggestion(request);
      return parseOpenAIResponse(data);
    },
    onError: (error) => {
      console.error(error);

      if (
        error instanceof Error &&
        error.message === NOTICE_SUGGESTION_ERROR_CODES.RATE_LIMIT
      ) {
        toast({
          title: '오늘의 문구 추천 횟수를 모두 사용했어요.',
          description: '내일 다시 시도해주세요.',
          variant: 'error',
          duration: 5000,
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message === NOTICE_SUGGESTION_ERROR_CODES.INVALID_FORMAT
      ) {
        toast({
          title: '적절한 문구를 추천 받지 못했어요.',
          description: '다시 시도해주세요.',
          variant: 'error',
          duration: 5000,
        });
        return;
      }

      toast({
        title: '잠시 후 다시 시도해주세요.',
        description:
          '너무 자주 요청했거나 서버 연결이 원활하지 않을 수 있어요.',
        variant: 'error',
        duration: 5000,
      });
    },
  });
};
