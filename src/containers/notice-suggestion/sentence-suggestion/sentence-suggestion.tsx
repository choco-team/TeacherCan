'use client';

import { Fragment, useState } from 'react';
import { SparkleIcon } from 'lucide-react';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/badge';
import { useCreateNoticeSuggestion } from '@/hooks/apis/notice-suggestion/use-create-notice-suggestion';
import { Skeleton } from '@/components/skeleton';
import { cn } from '@/styles/utils';
import theme from '@/styles/theme';
import { getRandomBadgeColor } from '../notice-suggestion.utils';
import { NOTICE_SUGGESTION_EXAMPLES } from '../notice-suggestion.constants';
import type {
  NoticeSuggestion,
  NoticeSuggestionCategory,
} from '../notice-suggestion.types';
import SentenceCategories from './sentence-categories';

export default function SentenceSuggestion() {
  const [selectedCategory, setSelectedCategory] =
    useState<NoticeSuggestionCategory>('');
  const [customCategory, setCustomCategory] = useState('');
  const [suggestions, setSuggestions] = useState<NoticeSuggestion[]>(
    NOTICE_SUGGESTION_EXAMPLES,
  );

  const { toast } = useToast();
  const { mutate: generateNoticeSuggestion, isPending } =
    useCreateNoticeSuggestion();

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: '클립보드에 복사했어요.', variant: 'success' });
    });
  };

  const handleCopyAll = () => {
    const text = suggestions
      .map(({ category, sentence }) => `[${category}] ${sentence}`)
      .join('\n');
    copy(text);
  };

  const handleSuggest = async () => {
    const category =
      selectedCategory === 'custom' ? customCategory : selectedCategory;
    generateNoticeSuggestion(
      { category },
      {
        onSuccess: (data) => {
          if (Array.isArray(data?.suggestions)) {
            setSuggestions((prev) => [...data.suggestions, ...prev]);
          }
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex items-center gap-x-2">
        <h1 className="text-xl font-bold">알림장 문구 추천</h1>
        <Badge
          variant="secondary-outline"
          size="sm"
          className="flex items-center gap-x-1"
        >
          AI
          <SparkleIcon className="size-3" />
        </Badge>
      </div>

      <section className="space-y-4">
        <h2 className="font-semibold">카테고리 선택</h2>
        <div
          className={cn(
            'flex items-center justify-between gap-x-3',
            'max-sm:flex-col max-sm:items-stretch max-sm:gap-y-2',
          )}
        >
          <SentenceCategories
            selectedCategory={selectedCategory}
            customCategory={customCategory}
            setSelectedCategory={setSelectedCategory}
            setCustomCategory={setCustomCategory}
          />
          <Button
            size="md"
            disabled={selectedCategory === 'custom' && !customCategory}
            isPending={isPending}
            onClick={handleSuggest}
          >
            문구 추천 받기
          </Button>
        </div>
      </section>

      <div className="space-y-10">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">추천 문구</h2>
            <Button variant="gray-ghost" size="sm" onClick={handleCopyAll}>
              모두 복사
            </Button>
          </div>

          <Card
            className={cn(
              'grid grid-cols-[auto_1fr_auto] content-start items-center gap-2 px-5 py-4 h-[50vh] min-h-[20rem] max-h-[40rem] overflow-auto',
              'max-sm:p-3 max-sm:gap-y-3 max-sm:h-full',
            )}
          >
            {isPending &&
              Array.from({ length: 5 }, (_, index) => (
                <Fragment key={index}>
                  <Skeleton className={cn('w-full h-5', 'max-sm:h-6')} />
                  <Skeleton className="w-full h-6" />
                  <Skeleton className={cn('w-full h-9', 'max-sm:h-6')} />
                </Fragment>
              ))}

            {suggestions.map(({ category, sentence }) => (
              <Fragment key={sentence}>
                <Badge
                  size="sm"
                  className={cn(
                    'justify-center text-center text-white tracking-tight',
                    'max-sm:p-1 max-sm:w-12 max-sm:h-full max-sm:rounded-none max-sm:text-2xs',
                  )}
                  style={{
                    backgroundColor: category
                      ? getRandomBadgeColor(category)
                      : theme.colors.primary.DEFAULT,
                  }}
                >
                  {category || '랜덤'}
                </Badge>
                <p
                  className={cn(
                    'text-card-foreground relative w-fit after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gray-300 after:transition-all after:duration-300 [&:nth-child(3n+2):has(+_button:hover)]:after:w-full',
                    'max-sm:text-sm',
                  )}
                >
                  {sentence}
                </p>

                <Button
                  variant="primary-ghost"
                  size="sm"
                  onClick={() => copy(sentence)}
                  className="max-sm:h-6 max-sm:rounded-sm max-sm:px-2 max-sm:text-xs"
                >
                  복사
                </Button>
              </Fragment>
            ))}
          </Card>
        </section>
      </div>
    </div>
  );
}
