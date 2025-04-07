'use client';

import { useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

import { Button } from '@/components/button';
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
import type { NoticeSuggestionCategory } from '../notice-suggestion.types';

type Props = {
  selectedCategory: NoticeSuggestionCategory;
  customCategory: string;
  setSelectedCategory: (value: NoticeSuggestionCategory) => void;
  setCustomCategory: (value: string) => void;
};

export default function SentenceCategories({
  selectedCategory,
  customCategory,
  setSelectedCategory,
  setCustomCategory,
}: Props) {
  const [open, setOpen] = useState(false);

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
            {selectedCategory
              ? NOTICE_SUGGESTION_CATEGORIES.find(
                  (category) => category.value === selectedCategory,
                )?.label
              : '랜덤'}
            <ChevronsUpDownIcon className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[12rem] p-0">
          <Command>
            <CommandInput placeholder="카테고리 검색" />
            <CommandList>
              <CommandEmpty>카테고리가 없어요.</CommandEmpty>
              <CommandGroup>
                {NOTICE_SUGGESTION_CATEGORIES.map((category) => (
                  <CommandItem
                    key={category.value}
                    value={category.value}
                    onSelect={(currentValue) => {
                      setSelectedCategory(
                        currentValue === selectedCategory
                          ? ''
                          : (currentValue as NoticeSuggestionCategory),
                      );
                      if (currentValue !== 'custom' && customCategory) {
                        setCustomCategory('');
                      }
                      setOpen(false);
                    }}
                  >
                    {category.label}
                    <CheckIcon
                      className={cn(
                        'ml-auto size-4',
                        selectedCategory === category.value
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCategory === 'custom' && (
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
