'use client';

import { useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';
import { cn } from '@/styles/utils';
import { Input } from '@/components/input';
import { NOTICE_SUGGESTION_CATEGORIES } from '../notice-suggestion.constants';
import type { NoticeSuggestionCategoryValue } from '../notice-suggestion.types';

type Props = {
  selectedCategoryValue: NoticeSuggestionCategoryValue;
  customCategory: string;
  setSelectedCategoryValue: (value: NoticeSuggestionCategoryValue) => void;
  setCustomCategory: (value: string) => void;
};

export default function SentenceCategories({
  selectedCategoryValue,
  customCategory,
  setSelectedCategoryValue,
  setCustomCategory,
}: Props) {
  const [open, setOpen] = useState(false);
  const selectedCategory = NOTICE_SUGGESTION_CATEGORIES.find(
    (category) => category.value === selectedCategoryValue,
  );

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="gray-outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-[12rem] justify-between', 'max-sm:w-full')}
          >
            {selectedCategory ? (
              <span className="flex items-center gap-x-1">
                {selectedCategory.label}
                {selectedCategory.isRecommended && (
                  <Badge size="xs" variant="primary">
                    추천
                  </Badge>
                )}
              </span>
            ) : (
              '랜덤'
            )}
            <ChevronsUpDownIcon className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[12rem] p-0">
          <Command>
            <CommandInput placeholder="카테고리 검색" />
            <CommandList>
              <CommandEmpty>카테고리가 없어요.</CommandEmpty>
              <CommandGroup>
                {NOTICE_SUGGESTION_CATEGORIES.map(
                  ({ label, value, isRecommended }) => (
                    <CommandItem
                      key={value}
                      value={value}
                      className="gap-x-1"
                      onSelect={(currentValue) => {
                        setSelectedCategoryValue(
                          currentValue === selectedCategoryValue
                            ? ''
                            : (currentValue as NoticeSuggestionCategoryValue),
                        );
                        if (currentValue !== 'custom' && customCategory) {
                          setCustomCategory('');
                        }
                        setOpen(false);
                      }}
                    >
                      {label}
                      {isRecommended && (
                        <Badge size="xs" variant="primary">
                          추천
                        </Badge>
                      )}
                      <CheckIcon
                        className={cn(
                          'ml-auto size-4',
                          selectedCategoryValue === value
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ),
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCategoryValue === 'custom' && (
        <Input
          value={customCategory}
          placeholder="카테고리를 입력하세요"
          onChange={(event) => setCustomCategory(event.target.value)}
          className="flex-1"
        />
      )}
    </>
  );
}
