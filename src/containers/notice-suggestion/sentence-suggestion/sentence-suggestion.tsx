'use client';

import { Fragment, useState } from 'react';
import Image from 'next/image';
import { SparkleIcon } from 'lucide-react';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/badge';
import { useCreateNoticeSuggestion } from '@/hooks/apis/notice-suggestion/use-create-notice-suggestion';
import { Skeleton } from '@/components/skeleton';
import { cn } from '@/styles/utils';
import theme from '@/styles/theme';
import { Heading1, Heading2 } from '@/components/heading';
import { getRandomBadgeColor } from '../notice-suggestion.utils';
import type {
  NoticeSuggestion,
  NoticeSuggestionCategoryValue,
} from '../notice-suggestion.types';
import SentenceCategories from './sentence-categories';
import { NOTICE_SUGGESTION_CATEGORIES } from '../notice-suggestion.constants';

export default function SentenceSuggestion() {
  const [selectedCategoryValue, setSelectedCategoryValue] =
    useState<NoticeSuggestionCategoryValue>(
      NOTICE_SUGGESTION_CATEGORIES[0].isRecommended
        ? NOTICE_SUGGESTION_CATEGORIES[0].value
        : '',
    );
  const [customCategory, setCustomCategory] = useState('');
  const [suggestions, setSuggestions] = useState<NoticeSuggestion[]>([]);

  const { toast } = useToast();
  const { mutate: generateNoticeSuggestion, isPending } =
    useCreateNoticeSuggestion();

  const isEmpty = !suggestions.length && !isPending;

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
      selectedCategoryValue === 'custom'
        ? customCategory
        : selectedCategoryValue;
    generateNoticeSuggestion(
      { category },
      {
        onSuccess: (data) => {
          setSuggestions((prev) => [...data, ...prev]);
        },
      },
    );
  };

  return (
    <div className="flex-grow flex flex-col gap-y-10">
      <Heading1>
        알림장 문구 추천
        <Badge
          variant="secondary-outline"
          size="sm"
          className="flex items-center gap-x-1"
        >
          AI
          <SparkleIcon className="size-3" />
        </Badge>
      </Heading1>

      <section className="space-y-4">
        <Heading2 className="font-semibold">카테고리 선택</Heading2>
        <div
          className={cn(
            'flex items-center justify-between gap-x-3',
            'max-sm:flex-col max-sm:items-stretch max-sm:gap-y-2',
          )}
        >
          <SentenceCategories
            selectedCategoryValue={selectedCategoryValue}
            customCategory={customCategory}
            setSelectedCategoryValue={setSelectedCategoryValue}
            setCustomCategory={setCustomCategory}
          />
          <Button
            size="md"
            disabled={selectedCategoryValue === 'custom' && !customCategory}
            isPending={isPending}
            onClick={handleSuggest}
          >
            문구 추천 받기
          </Button>
        </div>
      </section>

      <div className="flex-grow flex flex-col gap-y-10">
        <section className="flex-grow flex flex-col gap-y-4">
          <div className="flex items-center justify-between">
            <Heading2>추천 문구</Heading2>
            <Button
              variant="gray-ghost"
              size="sm"
              disabled={!suggestions.length}
              className={cn(!suggestions.length && 'invisible')}
              onClick={handleCopyAll}
            >
              모두 복사
            </Button>
          </div>

          <Card
            className={cn(
              'flex-grow grid grid-cols-[auto_1fr_auto] items-center gap-2',
              isEmpty ? 'content-center' : 'content-start',
              'px-5 py-4 h-[50vh] min-h-[20rem] max-h-[40rem] overflow-auto',
              'max-sm:p-3 max-sm:gap-y-3 max-sm:max-h-full',
            )}
          >
            {isPending &&
              Array.from({ length: 5 }, (_, index) => (
                <Skeleton
                  key={index}
                  className={cn(
                    'col-span-full h-6 my-1.5',
                    'max-sm:my-[0.1375rem]',
                  )}
                />
              ))}

            {suggestions.map(({ category, sentence }) => (
              <Fragment key={sentence}>
                <Badge
                  size="sm"
                  className={cn(
                    'justify-center text-center text-white tracking-tight',
                    'sm:min-w-20',
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
                    'text-text-title relative w-fit after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gray-300 after:transition-all after:duration-300 [&:nth-child(3n+2):has(+_button:hover)]:after:w-full',
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

            {isEmpty && (
              <div className="col-span-full flex flex-col items-center justify-center gap-y-4">
                <Image
                  src="/image/notice-suggestion/sprout-book.png"
                  alt="말의 씨앗"
                  width={50}
                  height={50}
                />
                <p
                  className={cn('text-center text-gray-400', 'max-sm:text-sm')}
                >
                  오늘 알림장에 심을 말의 씨앗을 골라볼까요?
                </p>
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}
